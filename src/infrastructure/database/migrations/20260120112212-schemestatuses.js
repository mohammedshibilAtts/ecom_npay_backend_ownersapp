/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    try {
        const schemeStatus = [{
            "id_status": 0,
            "status_name": "Open",
            "active": true,
            "is_deleted": false
        },
        {
            "id_status": 4,
            "status_name": "Refund",
            "active": true,
            "is_deleted": false
        },
        {
            "id_status": 1,
            "status_name": "Closed",
            "active": false,
            "is_deleted": true
        },
        {
            "id_status": 2,
            "status_name": "Completed",
            "active": true,
            "is_deleted": false
        },
        {
            "id_status": 3,
            "status_name": "Pre Closed",
            "active": true,
            "is_deleted": false
        },
        {
            "id_status": "6",
            "status_name": "Partially Pre-Closed",
            "active": false,
            "is_deleted": true
        },
        {
            "id_status": "5",
            "status_name": "Partially Closed",
            "active": false,
            "is_deleted": true
        },
        {
            "id_status": 7,
            "status_name": "All",
            "active": false,
            "is_deleted": false
        }]

        const collection = db.collection("schemestatuses");
    const now = new Date();

    const operations = schemeStatus.map((status) => ({
      updateOne: {
        filter: { status_name: status.status_name },
        update: {
          $setOnInsert: { createdAt: now },
          $set: {
            ...status,
            updatedAt: now,
          },
        },
        upsert: true,
      },
    }));

    await collection.bulkWrite(operations);

    console.log("✅ Scheme statuses seeded/updated successfully.");
  } catch (error) {
    console.error("❌ Error seeding scheme statuses:", error);
    throw error;
  }
};
