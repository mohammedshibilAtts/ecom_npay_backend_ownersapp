/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    const stateArray = [
      {
        "id_state": "1",
        "state_name": "Andaman and Nicobar Islands"
      },
      {
        "id_state": "10",
        "state_name": "Delhi"
      },
      {
        "id_state": "11",
        "state_name": "Goa"
      },
      {
        "id_state": "12",
        "state_name": "Gujarat"
      },
      {
        "id_state": "13",
        "state_name": "Haryana"
      },
      {
        "id_state": "14",
        "state_name": "Himachal Pradesh"
      },
      {
        "id_state": "15",
        "state_name": "Jammu and Kashmir"
      },
      {
        "id_state": "16",
        "state_name": "Jharkhand"
      },
      {
        "id_state": "17",
        "state_name": "Karnataka"
      },
      {
        "id_state": "19",
        "state_name": "Kerala"
      },
      {
        "id_state": "2",
        "state_name": "Andhra Pradesh"
      },
      {
        "id_state": "20",
        "state_name": "Lakshadweep"
      },
      {
        "id_state": "21",
        "state_name": "Madhya Pradesh"
      },
      {
        "id_state": "22",
        "state_name": "Maharashtra"
      },
      {
        "id_state": "23",
        "state_name": "Manipur"
      },
      {
        "id_state": "24",
        "state_name": "Meghalaya"
      },
      {
        "id_state": "25",
        "state_name": "Mizoram"
      },
      {
        "id_state": "26",
        "state_name": "Nagaland"
      },
      {
        "id_state": "29",
        "state_name": "Odisha"
      },
      {
        "id_state": "3",
        "state_name": "Arunachal Pradesh"
      },
      {
        "id_state": "31",
        "state_name": "Pondicherry"
      },
      {
        "id_state": "32",
        "state_name": "Punjab"
      },
      {
        "id_state": "33",
        "state_name": "Rajasthan"
      },
      {
        "id_state": "34",
        "state_name": "Sikkim"
      },
      {
        "id_state": "35",
        "state_name": "Tamil Nadu"
      },
      {
        "id_state": "36",
        "state_name": "Telangana"
      },
      {
        "id_state": "37",
        "state_name": "Tripura"
      },
      {
        "id_state": "38",
        "state_name": "Uttar Pradesh"
      },
      {
        "id_state": "39",
        "state_name": "Uttarakhand"
      },
      {
        "id_state": "4",
        "state_name": "Assam"
      },
      {
        "id_state": "41",
        "state_name": "West Bengal"
      },
      {
        "id_state": "5",
        "state_name": "Bihar"
      },
      {
        "id_state": "6",
        "state_name": "Chandigarh"
      },
      {
        "id_state": "7",
        "state_name": "Chhattisgarh"
      },
      {
        "id_state": "8",
        "state_name": "Dadra and Nagar Haveli"
      },
      {
        "id_state": "9",
        "state_name": "Daman and Diu"
      }
    ]

    const collection = db.collection("states");
    const countryCollection = db.collection("countries");

    let indiaCountry = await countryCollection.findOne({ country_name: "India" });
    
    if (!indiaCountry) {
      console.log("Creating India doc record...");
      const insertResult = await countryCollection.insertOne({
        id_country: 101,
        sortname: "IN",
        country_name: "India",
        currency_name: "Rupees",
        currency_code: "INR",
        mob_code: "+91",
        mob_no_len: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      indiaCountry = { _id: insertResult.insertedId };
    }
    
    const bulkOps = [];
    const now = new Date();
    
    for (const state of stateArray) {
      bulkOps.push({
        updateOne: {
          filter: { 
            $or: [
              { id_state: state.id_state },
              { state_name: state.state_name }
            ]
          },
          update: {
            $setOnInsert: {
              id_state: state.id_state,
              state_name: state.state_name,
              id_country: indiaCountry._id,
              createdAt: now,
            },
            $set: {
              updatedAt: now,
            }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      const result = await collection.bulkWrite(bulkOps, { ordered: false });
      
      console.log(`✅ State seeding completed:`);
      console.log(`   Matched: ${result.matchedCount}`);
      console.log(`   Modified: ${result.modifiedCount}`);
      console.log(`   Upserted: ${result.upsertedCount}`);
      console.log(`   Total states: ${stateArray.length}`);
    }
    
  } catch (error) {
    console.error("❌ Seeder error:", error);
    throw error;
  }
};