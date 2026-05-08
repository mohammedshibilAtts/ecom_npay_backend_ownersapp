import cron from "node-cron";
import dotenv from "dotenv";

import Customer from "../infrastructure/models/chit/customerModel.js";
import OverdueQueue from "../infrastructure/models/chit/overdueQeueModel.js";
import smsService from "../config/chit/smsService.js";
import overdueRepo from "../infrastructure/repositories/chit/schemeAccountRepository.js";

dotenv.config();

const TIMEZONE = "Asia/Kolkata";

// Runs daily at 10:28 AM to prepare overdue messages
const PREPARE_CRON = "0 3 * * *";

const SEND_CRON = "0 7 * * *";

const CUSTOMER_BATCH = 300;
const SEND_BATCH = 50;

class OverdueNotificationScheduler {
  constructor() {
    this.initialize();
    this.overdueRepo =  new overdueRepo()
  }

  initialize() {
    cron.schedule(PREPARE_CRON, this.prepareOverdueNotifications.bind(this), { timezone: TIMEZONE });
    cron.schedule(SEND_CRON, this.sendOverdueNotifications.bind(this), { timezone: TIMEZONE });

    console.log("✅ Overdue Scheduler Started");
  }

  async prepareOverdueNotifications() {
    console.log("⏳ Preparing overdue notifications...");

    try {
      const cursor = Customer.find({
        active: true,
        is_deleted: false
      })
        .lean()
        .cursor();

      let batch = [];

      for (let customer = await cursor.next(); customer != null; customer = await cursor.next()) {
        batch.push(customer);

        if (batch.length >= CUSTOMER_BATCH) {
          await this.processCustomerBatch(batch);
          batch = [];
        }
      }

      if (batch.length > 0) {
        await this.processCustomerBatch(batch);
      }

      console.log("✅ Finished preparing overdue notifications");

    } catch (err) {
      console.error("❌ Error preparing overdue notifications:", err);
    }
  }

  async processCustomerBatch(batch) {
    /*
    // ---------------- OLD SEQUENTIAL LOOP LOGIC ----------------
    let queueEntries = [];

    for (const c of batch) {
      try {
        const overdueResult = await this.overdueRepo.overdueCalculationForNotification(c._id);

        if (!overdueResult || overdueResult.overdueAccountNumbers.length === 0) {
          continue;
        }

        queueEntries.push({
          insertOne: {
            document: {
              customerId: c._id,
              mobile: c.mobile?.toString(),
              name: c.firstname,
              overdueAccounts: overdueResult.overdueAccountNumbers,
              cronStatus: 1,
              sendStatus: 2,
              scheduledAt: this.getTodayAt8PM()
            }
          }
        });

      } catch (err) {
        console.error(`❌ Error processing overdue for ${c._id}:`, err);
      }
    }
    */

    // ---------------- NEW OPTIMIZED CONCURRENT LOGIC ----------------
    const processPromises = batch.map(async (c) => {
      try {
        const overdueResult = await this.overdueRepo.overdueCalculationForNotification(c._id);

        if (!overdueResult || overdueResult.overdueAccountNumbers.length === 0) {
          return null;
        }

        return {
          insertOne: {
            document: {
              customerId: c._id,
              mobile: c.mobile?.toString(),
              name: c.firstname,
              overdueAccounts: overdueResult.overdueAccountNumbers,
              cronStatus: 1,
              sendStatus: 2,
              scheduledAt: this.getTodayAt8PM(),
            },
          },
        };
      } catch (err) {
        console.error(`❌ Error processing overdue for ${c._id}:`, err);
        return null;
      }
    });

    const results = await Promise.all(processPromises);
    const queueEntries = results.filter((entry) => entry !== null);

    if (queueEntries.length > 0) {
      await OverdueQueue.bulkWrite(queueEntries);
      console.log(`✅ Saved ${queueEntries.length} overdue messages`);
    }
  }

  getTodayAt8PM() {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    return d;
  }

  async sendOverdueNotifications() {
    console.log("📤 Sending overdue notifications...");

    try {
      let skip = 0;

      while (true) {
        const batch = await OverdueQueue.find({
          sendStatus: 2,
        })
          .limit(SEND_BATCH)
          .skip(skip);

        if (batch.length === 0) break;

        await Promise.all(
          batch.map(async (msg) => {
            try {
              const messageText = `Dear ${msg.name}, your following chit accounts are overdue: ${msg.overdueAccounts.join(", ")}.`;

              const input = {
                recipients: [msg.customerId],
                title: "Overdue Alert",
                message: messageText,
                channel: "push"
              };

              await smsService.sendNotification(input);

              await OverdueQueue.findByIdAndUpdate(msg._id, {
                sendStatus: 1,
                sentAt: new Date()
              });

            } catch (err) {
              console.error("❌ Failed sending overdue msg:", msg.mobile, err.message);
            }
          })
        );

        skip += SEND_BATCH;
        console.log(`✅ Sent overdue batch of ${batch.length}`);
      }

      console.log("✅ Completed overdue message sending");

    } catch (err) {
      console.error("❌ Error in overdue notification sender:", err);
    }
  }
}

new OverdueNotificationScheduler();
