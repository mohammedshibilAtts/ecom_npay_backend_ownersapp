/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
   try {
    const statuses = [{
        "id_status": 2,
        "payment_status": "Pending",
        "color": "#FFA500",
        "remark": "Awaiting payment"
      },
      {
        "id_status": 1,
        "payment_status": "Success",
        "color": "#FFA500",
        "remark": "Payment Success"
      },
      {
        "id_status": 0,
        "payment_status": "Failed",
        "color": "#FFA500",
        "remark": "Payment Failed"
      }]

      const collection = db.collection("paymentstatuses");

      for(let status of statuses){
      const exists = await collection.findOne({id_status: status?.id_status});

      if(exists){
        continue
      }

      await collection.insertOne({
        ...status,
        createdAt:new Date(),
        updatedAt:new Date()
      })
      }
   } catch (error) {
    console.error(error)
   }
};
