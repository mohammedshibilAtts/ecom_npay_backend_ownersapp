/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    try {
      console.log("🚀 Seeding notification configuration...");
  
      const collection = db.collection("notificationconfigs");
  
      const data = {
        pushNotification: {
          enabled: true,
          settings: {
            schemeWise: {
              paymentProceed: true,
              schemeJoining: true,
              schemeCompletion: true,
              schemeClose: true,
              schemeReferral: true,
              walletAmountRedeem: true,
              overdue: true,
            },
            wishes: {
              birthday: true,
              weddingAnniversary: true,
            },
            product: {
              newArrival: true,
            },
          },
        },
        sms: {
          enabled: false,
          settings: {
            schemeWise: {
              paymentProceed: false,
              schemeJoining: false,
              schemeCompletion: false,
              schemeClose: false,
              schemeReferral: false,
              walletAmountRedeem: false,
              overdue: false,
            },
            wishes: {
              birthday: false,
              weddingAnniversary: false,
            },
            product: {
              newArrival: false,
            },
          },
        },
        whatsapp: {
          enabled: false,
          settings: {
            schemeWise: {
              paymentProceed: false,
              schemeJoining: false,
              schemeCompletion: false,
              schemeClose: false,
              schemeReferral: false,
              walletAmountRedeem: false,
              overdue: false,
            },
            wishes: {
              birthday: false,
              weddingAnniversary: false,
            },
            product: {
              newArrival: false,
            },
          },
        },
        email: {
          enabled: false,
          settings: {
            schemeWise: {
              paymentProceed: false,
              schemeJoining: false,
              schemeCompletion: false,
              schemeClose: false,
              schemeReferral: false,
              walletAmountRedeem: false,
              alertNotification: false,
            },
            wishes: {
              birthday: true,
              weddingAnniversary: true,
            },
            product: {
              newArrival: true,
            },
          },
        },
        active: true,
      };
  

      const existing = await collection.findOne({});
      if (existing) {
        console.log("⚠️ Notification configuration already exists. Skipping insert.");
        return;
      }
  
      await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      console.log("✅ Notification configuration inserted successfully.");
    } catch (error) {
      console.error("❌ Error inserting notification configuration:", error);
      throw error;
    }
  };
  