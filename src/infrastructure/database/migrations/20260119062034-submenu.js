export const up = async (db) => {
  console.log("🚀 Seeding submenu via Native MongoDB");

  try {
    const submenus = [
      {
        "submenu_name": "New Arrivals",
        "menu_name": "Catalogue",
        "pathurl": "/catalog/newarrivals/",
        "display_order": 13,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Gift Vendor",
        "menu_name": "Gift",
        "pathurl": "/gift/giftvendor",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Existing Scheme",
        "menu_name": "Scheme",
        "pathurl": "/scheme/scheme/",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "User Role",
        "menu_name": "User Settings",
        "pathurl": "/masters/userrole",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Existing customer",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/customer",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Metal",
        "menu_name": "Masters",
        "pathurl": "/masters/metal/",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Gift Handover",
        "menu_name": "Gift",
        "pathurl": "/gift/gifthandover",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Purity",
        "menu_name": "Masters",
        "pathurl": "/masters/purity/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Gift Item",
        "menu_name": "Gift",
        "pathurl": "/gift/giftitem/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Staff User",
        "menu_name": "User Settings",
        "pathurl": "/setup/staffuser/",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Offers",
        "menu_name": "Catalogue",
        "pathurl": "/catalog/offers/",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Menu",
        "menu_name": "User Settings",
        "pathurl": "/setup/menu/",
        "display_order": 7,
        "active": false,
        "is_deleted": false,
        "visible": true,
        "adminVisible": true
      },
      {
        "submenu_name": "Over Due",
        "menu_name": "Scheme Report",
        "pathurl": "/report/overdue/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Scheme Payment",
        "menu_name": "Scheme Report",
        "pathurl": "/reports/schemepayment",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Gift Purchase",
        "menu_name": "Gift",
        "pathurl": "/gift/giftpurchase/",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Product",
        "menu_name": "Catalogue",
        "pathurl": "/catalog/product/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Category",
        "menu_name": "Catalogue",
        "pathurl": "/catalog/category/",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "User Access",
        "menu_name": "User Settings",
        "pathurl": "/usersettings/useraccess/",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Gift Stock Report",
        "menu_name": "Gift",
        "pathurl": "/gift/stockreport/",
        "display_order": 5,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Weight Payable",
        "menu_name": "Scheme Report",
        "pathurl": "/report/weightpayable",
        "display_order": 6,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Employee Creation",
        "menu_name": "Employee",
        "pathurl": "/employee/creation",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Sub Menu",
        "menu_name": "User Settings",
        "pathurl": "/setup/submenu/",
        "display_order": 8,
        "active": false,
        "is_deleted": false,
        "visible": true,
        "adminVisible": true
      },
      {
        "submenu_name": "Completed Account",
        "menu_name": "Scheme Report",
        "pathurl": "/report/completedaccount",
        "display_order": 7,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Metal Rate",
        "menu_name": "Masters",
        "pathurl": "/masters/metalrate/",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Account Summary ",
        "menu_name": "Scheme Report",
        "pathurl": "/reports/accountsummary",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Department",
        "menu_name": "User Settings",
        "pathurl": "/usersettings/department",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Topup",
        "menu_name": "User Settings",
        "pathurl": "/usersettings/topup",
        "display_order": 6,
        "active": false,
        "is_deleted": true,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Add Scheme",
        "menu_name": "Scheme",
        "pathurl": "/scheme/addscheme",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Add To Scheme",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/addcustomer",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Pre Close Account",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/preclose",
        "display_order": 6,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Customer Payment",
        "menu_name": "Payment",
        "pathurl": "/payment/addschemepayment",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Employee Details",
        "menu_name": "Employee",
        "pathurl": "/employee/details/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Wallet Redeemption",
        "menu_name": "Wallet",
        "pathurl": "/wallet/redeemption/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Redeem History",
        "menu_name": "Wallet",
        "pathurl": "/wallet/redeemhistory/",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Wallet History",
        "menu_name": "Wallet",
        "pathurl": "/wallet/wallethistory/",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Organisation",
        "menu_name": "User Settings",
        "pathurl": "/usersettings/organisation",
        "display_order": 5,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Policies",
        "menu_name": "Help",
        "pathurl": "/help/policy",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Overall Report",
        "menu_name": "Scheme Report",
        "pathurl": "/report/overallreport/",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Pre close summary",
        "menu_name": "Scheme Report",
        "pathurl": "/reports/preclosesummary",
        "display_order": 6,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Closed Summary",
        "menu_name": "Scheme Report",
        "pathurl": "/report/redemptionsummary/",
        "display_order": 7,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Refund Summary",
        "menu_name": "Scheme Report",
        "pathurl": "/report/refund/",
        "display_order": 8,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Promotions Summary",
        "menu_name": "Scheme Report",
        "pathurl": "/schemereport/promosummary/",
        "display_order": 10,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Notification Summary",
        "menu_name": "Scheme Report",
        "pathurl": "/schemereport/notification/",
        "display_order": 11,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Topup Summary",
        "menu_name": "Scheme Report",
        "pathurl": "/schemereport/topupsummary/",
        "display_order": 12,
        "active": false,
        "is_deleted": true,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": " Employee Referral",
        "menu_name": "Accounts Report",
        "pathurl": "/accountreport/employeereferrals",
        "display_order": 5,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Customer Referral ",
        "menu_name": "Accounts Report",
        "pathurl": "/accountreport/customerreferrals",
        "display_order": 6,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "FAQ",
        "menu_name": "Help",
        "pathurl": "/help/faq/",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Ticket Raise",
        "menu_name": "Help",
        "pathurl": "/help/raiseticket/",
        "display_order": 5,
        "active": false,
        "is_deleted": true,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "CampaignType",
        "menu_name": "Promotions",
        "pathurl": "/promotions/campaign",
        "display_order": 9,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Account Closure",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/accountredemption",
        "display_order": 3,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Configurations",
        "menu_name": "Notification",
        "pathurl": "/notification/configurations",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Promotions Creation",
        "menu_name": "Promotions",
        "pathurl": "/promotions/promotioncreations",
        "display_order": 2,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Customer Schemes",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/customerschemes",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Delisted Schemes",
        "menu_name": "Scheme",
        "pathurl": "/scheme/delisted",
        "display_order": 5,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Amount Payble",
        "menu_name": "Scheme Report",
        "pathurl": "/report/amountpayble",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
        "submenu_name": "Customer List",
        "menu_name": "Manage Customers",
        "pathurl": "/managecustomers/customers",
        "display_order": 1,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      },
      {
      "submenu_name": "Payment Mode Ledger",
      "menu_name":"Accounts Report",
      "pathurl": "/report/paymentmodeledger/",
      "display_order": 1,
      "active": true,
      "is_deleted": false,
      "visible": true,
      "adminVisible": false
    }
    ]

    const collection = db.collection("submenusettings");
    const menuCollection = db.collection("menus");
    const digiSilverEnabled = process.env.DIGI_SILVER === 'true';
    const digiGoldEnabled = process.env.DIGI_GOLD === 'true';
    const ecom = process.env.ECOM === 'true';

    if (digiSilverEnabled) {
      submenus.push({
        "submenu_name": "Digi Silver",
        "menu_name": "Scheme",
        "pathurl": "/scheme/digisilver",
        "display_order": 4,
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false
      });
    }

    if (digiGoldEnabled) {
      submenus.push({
        "submenu_name": "Digi Gold",
        "menu_name": "Scheme",
        "pathurl": "/scheme/adddigigold",
        "active": true,
        "is_deleted": false,
        "visible": true,
        "adminVisible": false,
        "display_order": 3
      });
    }

    if(ecom){
      submenus.push(
        {
          "submenu_name": "Stone Master",
          "menu_name":"Masters",
          "pathurl": "/stoneDiamond/stonemaster",
          "display_order": 6,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "State Master",
          "menu_name":"Masters",
          "pathurl": "/masters/state",
          "display_order": 7,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Pincode",
          "menu_name":"Masters",
          "pathurl": "/pincode-master/pincode",
          "display_order": 5,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Size Master",
          "menu_name":"Masters",
          "pathurl": "/sizemaster/sizemaster",
          "display_order": 4,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Sub Category",
          "menu_name": "Catalogue",
          "pathurl": "/catalogue/subcategory",
          "display_order": 2,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Order Details",
          "menu_name": "Order",
          "pathurl": "/ecom/orderlist",
          "display_order": 1,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Orders",
          "menu_name": "Ecom Report",
          "pathurl": "/ecom/order-report",
          "display_order": 1,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        },
        {
          "submenu_name": "Stock Report",
          "menu_name": "Ecom Report",
          "pathurl": "/ecom/stock-report",
          "display_order": 2,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false
        },
        {
          "submenu_name": "Top Selling Product",
          "menu_name": "Ecom Report",
          "pathurl": "/ecom/topselling-report",
          "display_order": 3,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false
        },
        {
          "submenu_name": "Payment History",
          "menu_name": "Ecom Report",
          "pathurl": "/ecom/payment-report",
          "display_order": 4,
          "visible": true,
          "active": true,
          "is_deleted": false,
          "adminVisible": false,
        }
      )
    }

    const menuNames = [...new Set(submenus.map(menu => menu.menu_name))];
    
    const menus = await menuCollection.find(
      { menu_name: { $in: menuNames } },
      { projection: { _id: 1, menu_name: 1 } }
    ).toArray();
    
    const menuMap = new Map();
    menus.forEach(menu => {
      menuMap.set(menu.menu_name, menu._id);
    });

    const bulkOps = [];
    const existingSubmenus = await collection.find(
      { submenu_name: { $in: submenus.map(sm => sm.submenu_name) } },
      { projection: { submenu_name: 1 } }
    ).toArray();
    
    const existingSubmenuNames = new Set(existingSubmenus.map(sm => sm.submenu_name));

    const now = new Date();

    for (const menu of submenus) {
      const menuId = menu.id_menu ? menu.id_menu : menuMap.get(menu.menu_name);
      
      if (!menuId && !menu.id_menu) {
        console.warn(`⚠️ No menu found for submenu: ${menu.submenu_name}, menu: ${menu.menu_name}`);
        continue;
      }

      const dataToInsert = {
        submenu_name: menu.submenu_name,
        menu_name: menu.menu_name,
        id_menu: menuId || menu.id_menu,
        pathurl: menu.pathurl,
        display_order: menu.display_order || 999,
        active: menu.active !== undefined ? menu.active : true,
        is_deleted: menu.is_deleted !== undefined ? menu.is_deleted : false,
        visible: menu.visible !== undefined ? menu.visible : true,
        adminVisible: menu.adminVisible !== undefined ? menu.adminVisible : false,
        updatedAt: now
      };

      if (existingSubmenuNames.has(menu.submenu_name)) {
        bulkOps.push({
          updateOne: {
            filter: { submenu_name: menu.submenu_name },
            update: {
              $set: dataToInsert,
              $setOnInsert: { createdAt: now }
            },
            upsert: false
          }
        });
      } else {
        bulkOps.push({
          insertOne: {
            document: {
              ...dataToInsert,
              createdAt: now
            }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      const result = await collection.bulkWrite(bulkOps, { ordered: false });
      
      console.log(`✅ Submenu seeding completed:`);
      console.log(`   Inserted: ${result.insertedCount || 0}`);
      console.log(`   Updated: ${result.modifiedCount || 0}`);
      console.log(`   Total processed: ${bulkOps.length}`);
    } else {
      console.log(`ℹ️ No submenus to process`);
    }

  } catch (error) {
    console.error(`❌ Error seeding submenus:`, error);
    throw error;
  }
};