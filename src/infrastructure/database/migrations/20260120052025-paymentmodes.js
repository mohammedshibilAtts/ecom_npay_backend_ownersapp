/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    console.log("🚀 Seeding payment modes started...");

    const paymentMode = [
      {
        id_mode: 7,
        mode_name: "MULTI PAY",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 1,
        mode_name: "CASH",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 12,
        mode_name: "UPI",
        payment_method_type: "Offline",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 14,
        mode_name: "DEBIT CARD",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 6,
        mode_name: "CREDIT CARD",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 4,
        mode_name: "BANK TRANSFER",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
      {
        id_mode: 11,
        mode_name: "CASH FREE",
        payment_method_type: "Online",
        active: true,
        is_deleted: false,
      },
    ];

    const collection = db.collection("paymentmodes");

    await collection.createIndex({ id_mode: 1 }, { unique: true });

    for (const mode of paymentMode) {
      const exists = await collection.findOne({
        $or: [{ id_mode: mode.id_mode }, { mode_name: mode.mode_name }],
      });

      if (exists) {
        console.log(`⚠️ ${mode.mode_name} already exists. Skipping...`);
        continue;
      }

      await collection.insertOne({
        ...mode,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Inserted: ${mode.mode_name}`);
    }

    console.log("✅ Payment modes seeding completed!");
  } catch (error) {
    console.error("🔥 Error while seeding payment modes:", error.message);
    throw error;
  }
};