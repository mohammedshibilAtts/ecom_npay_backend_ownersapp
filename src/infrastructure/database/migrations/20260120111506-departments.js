/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
     const departments = [{
        "name": "Admin",
        "active": true,
        "is_deleted": false
      },
      {
        "name": "Billing",
        "active": true,
        "is_deleted": false
      }]

      const collection = db.collection("departments");

      for(let department of departments){
        const exists = await collection.findOne({name:department?.name})

        if(exists){
            continue
        }

        await collection.insertOne({
            ...department,
            createdAt:new Date(),
            updatedAt:new Date()
        })
      }
  } catch (error) {
    console.error(error)
  }
};

// /**
//  * @param db {import('mongodb').Db}
//  * @param client {import('mongodb').MongoClient}
//  * @returns {Promise<void>}
//  */
// export const down = async (db, client) => {
//     // TODO write the statements to rollback your migration (if possible)
//     // Example:
//     // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
// };
