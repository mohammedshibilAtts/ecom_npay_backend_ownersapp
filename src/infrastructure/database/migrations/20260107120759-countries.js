/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    try {
      const collection = db.collection("countries");
  
      const exists = await collection.findOne({ country_name: "India" });
      if (exists) return;
  
      await collection.insertOne({
        id_country: 101,
        sortname: "IN",
        country_name: "India",
        currency_name: "Rupees",
        currency_code: "INR",
        mob_code: "+91",
        mob_no_len: 10,
        date_upd: new Date("2019-11-04"),
      });
  
      console.log("✅ India inserted into countries collection");
    } catch (error) {
      console.error("❌ Seeder error:", error);
    }
  };
  