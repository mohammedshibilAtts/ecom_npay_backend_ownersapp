import { ObjectId } from "mongodb";

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    const schemetypes = [
      {
        scheme_type: 10,
        scheme_typename: "Digital Gold",
        active: true,
        is_deleted: true,
      },
      {
        scheme_type: 0,
        scheme_typename: "bonus cashback scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 7,
        scheme_typename: "lock in weight-at-maturity scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 6,
        scheme_typename: "lock in metal value conversion scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 3,
        scheme_typename: "grams-based savings plan",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 2,
        scheme_typename: "metal value conversion scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 8,
        scheme_typename: "lock in bonus cashback scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 1,
        scheme_typename: "weight-at-maturity scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 4,
        scheme_typename: "lock in gram based saving plan",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 5,
        scheme_typename: "feasible metal value conversion scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 11,
        scheme_typename: "feasible weight-at-maturity scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 12,
        scheme_typename: "feasible gram based saving plan",
        active: true,
        is_deleted: false,
      },
      {
        _id: new ObjectId("67c05179e96cec659e47848a"),
        scheme_type: 13,
        scheme_typename: "feasible bonus cashback scheme",
        active: true,
        is_deleted: false,
      },
      {
        scheme_type: 14,
        scheme_typename: "Digital Silver",
        active: true,
        is_deleted: true,
      },
    ];

    const collection = db.collection("schemetypes");

    const schemeTypeNumbers = schemetypes.map((x) => x.scheme_type);

    const existing = await collection
      .find({ scheme_type: { $in: schemeTypeNumbers } })
      .project({ scheme_type: 1 })
      .toArray();

    const existingSet = new Set(existing.map((x) => x.scheme_type));

    const toInsert = schemetypes.filter((x) => !existingSet.has(x.scheme_type));

    if (toInsert.length > 0) {
      await collection.insertMany(toInsert);
      console.log(`✅ Inserted ${toInsert.length} scheme types`);
    } else {
      console.log("ℹ️ All scheme types already exist, nothing inserted");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};
