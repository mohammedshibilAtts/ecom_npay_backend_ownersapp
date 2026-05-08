export const up = async (db) => {
    console.log("🚀 Seeding Menu via Native MongoDB");
  
    const menus = [
      {
        "menu_name": "Scheme",
        "active": true,
        "display_order": 2,
        "is_deleted": false,
        "menu_icon": "uploads/icons/2.svg"
      },
      {
        "menu_name": "Payment",
        "active": true,
        "display_order": 5,
        "is_deleted": false,
        "menu_icon": "uploads/icons/5.svg"
      },
      {
        "menu_name": "Gift",
        "active": true,
        "display_order": 4,
        "is_deleted": false,
        "menu_icon": "uploads/icons/4.svg"
      },
      {
        "menu_name": "Catalogue",
        "active": true,
        "display_order": 7,
        "is_deleted": false,
        "menu_icon": "uploads/icons/7.svg"
      },
      {
        "menu_name": "Wallet",
        "active": true,
        "display_order": 8,
        "is_deleted": false,
        "menu_icon": "uploads/icons/8.svg"
      },
      {
        "menu_name": "Scheme Report",
        "active": true,
        "display_order": 12,
        "is_deleted": false,
        "menu_icon": "uploads/icons/12.svg"
      },
      {
        "menu_name": "Notification",
        "active": true,
        "display_order": 9,
        "is_deleted": false,
        "menu_icon": "uploads/icons/9.svg"
      },
      {
        "menu_name": "User Settings",
        "active": true,
        "display_order": 16,
        "is_deleted": false,
        "menu_icon": "uploads/icons/16.svg"
      },
      {
        "menu_name": "Masters",
        "active": true,
        "display_order": 1,
        "is_deleted": false,
        "menu_icon": "uploads/icons/1.svg"
      },
      {
        "menu_name": "Manage Customers",
        "active": true,
        "display_order": 3,
        "is_deleted": false,
        "menu_icon": "uploads/icons/3.svg"
      },
      {
        "menu_name": "Employee",
        "active": true,
        "display_order": 6,
        "is_deleted": false,
        "menu_icon": "uploads/icons/6.svg"
      },
      {
        "menu_name": "Promotions",
        "active": true,
        "display_order": 11,
        "is_deleted": false,
        "menu_icon": "uploads/icons/11.svg"
      },
      {
        "menu_name": "Accounts Report",
        "active": true,
        "display_order": 13,
        "is_deleted": false,
        "menu_icon": "uploads/icons/13.svg"
      },
      {
        "menu_name": "Help",
        "active": true,
        "display_order": 14,
        "is_deleted": false,
        "menu_icon": "uploads/icons/14.svg"
      }
    ]

    const ecom = process.env.ECOM === 'true';

    if(ecom){
      menus.push(
        {
          "menu_name": "Order",
          "menu_icon": "uploads/icons/18.svg",
          "active": true,
          "display_order": 7,
          "is_deleted": false,
        },
        {
          "menu_name": "Ecom Report",
          "menu_icon": "uploads/icons/19.svg",
          "active": true,
          "display_order": 13,
          "is_deleted": false,
        }
      )
    }
  
    const collection = db.collection("menus");
  
    for (const menu of menus) {
      const exists = await collection.findOne({ menu_name: menu.menu_name });
  
      if (!exists) {
        await collection.insertOne({
          ...menu,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Menu inserted: ${menu.menu_name}`);
      } else {
        console.log(`⚠️ Mneu already exists: ${menu.menu_name}`);
      }
    }
  };