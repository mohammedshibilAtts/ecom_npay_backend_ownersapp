/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    const referralMessage = [{
        "message": "I’ve been using the CHIT mobile app to manage and join chit funds easily—it’s super convenient and secure! You should check it out!\nDownload the app and use my referral code [REFERRAL_CODE] to sign up—you might even get a joining bonus! 💸\n\n👉 Download the app here:\nPlay Store: \n\nApp Store: "
      }]

      const collection = db.collection('referralmessages');

      const exists = await collection.findOne({})

      if(exists) return 

      await collection.insertOne({
        ...referralMessage,
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(error)
  }
};