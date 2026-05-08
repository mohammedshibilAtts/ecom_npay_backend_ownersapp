/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    try {
      console.log("🚀 Seeding classifications...");
  
      const classifications = [
        {
          name: "Flexi",
          description: "Flexible scheme plan",
          order: 1,
          active: true,
          is_deleted: false,
          payment_editable: true,
          classifcationImg: `${process.env.AWS_DISPLAY_URL}${process.env.AWS_LOCAL_PATH}classification/1768934789908.png`,
        },
        {
          name: "Fixed",
          description: "Fixed plan",
          order: 2,
          active: true,
          is_deleted: false,
          payment_editable: false,
          classifcationImg: `${process.env.AWS_DISPLAY_URL}${process.env.AWS_LOCAL_PATH}classification/1768934710608.png`,
        },
        {
          name: "Flexi-Fixed",
          description: "Make scheme more flexible",
          order: 3,
          active: true,
          is_deleted: false,
          payment_editable: false,
          classifcationImg: `${process.env.AWS_DISPLAY_URL}${process.env.AWS_LOCAL_PATH}classification/1768934764533.png`,
        },
      ];
  
      const collection = db.collection("schemeclassifications");
  
      const exists = await collection.findOne({ name: { $in: ["Flexi", "Fixed", "Flexi-Fixed"] } });
      if (exists) {
        console.log("⚠️ Classifications already exist. Skipping seed.");
        return;
      }
  
      const now = new Date();
      const docs = classifications.map((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
      }));
  
      await collection.insertMany(docs);
  
      console.log("✅ Classifications seeded successfully.");
    } catch (error) {
      console.error("❌ Error seeding classifications:", error);
      throw error;
    }
  };
  