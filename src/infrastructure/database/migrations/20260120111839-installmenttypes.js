/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    try {
      console.log("🚀 Seeding installment types started...");
  
      const installmentTypes = [
        {
          installment_type: 3,
          installment_name: "Daily",
          active: 1,
          sortOrder: 1,
        },
        {
          installment_type: 2,
          installment_name: "Week",
          active: 1,
          sortOrder: 2,
        },
        {
          installment_type: 4,
          installment_name: "Year",
          active: 1,
          sortOrder: 4,
        },
        {
          installment_type: 1,
          installment_name: "Month",
          active: 1,
          sortOrder: 3,
        },
      ];
  
      const collection = db.collection("installmenttypes");
  
      for (const installmentType of installmentTypes) {
        const exists = await collection.findOne({
          installment_type: installmentType.installment_type,
        });
  
        if (exists) {
          console.log(
            `⚠️ Installment type already exists: ${installmentType.installment_name}`
          );
          continue;
        }
  
        await collection.insertOne({
          ...installmentType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
        console.log(`✅ Inserted: ${installmentType.installment_name}`);
      }
  
      console.log("✅ Seeding installment types completed!");
    } catch (error) {
      console.error("❌ Seeding installment types failed:", error);
    }
  };
  