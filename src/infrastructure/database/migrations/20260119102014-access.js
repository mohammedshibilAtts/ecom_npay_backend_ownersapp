export const up = async (db) => {
  try {
    const menuData = [
      "New Arrivals",
      "Gift Vendor",
      "Existing Scheme",
      "User Role",
      "Existing customer",
      "Metal",
      "Gift Handover",
      "Purity",
      "Gift Item",
      "Staff User",
      "Offers",
      "Menu",
      "Over Due",
      "Scheme Payment",
      "Gift Purchase",
      "Product",
      "Category",
      "User Access",
      "Gift Stock Report",
      "Weight Payable",
      "Employee Creation",
      "Sub Menu",
      "Completed Account",
      "Metal Rate",
      "Account Summary ",
      "Department",
      "Topup",
      "Add Scheme",
      "Add To Scheme",
      "Pre Close Account",
      "Customer Payment",
      "Employee Details",
      "Wallet Redeemption",
      "Redeem History",
      "Wallet History",
      "Organisation",
      "Policies",
      "Overall Report",
      "Pre close summary",
      "Closed Summary",
      "Refund Summary",
      "Promotions Summary",
      "Notification Summary",
      "Topup Summary",
      " Employee Referral",
      "Customer Referral ",
      "FAQ",
      "Ticket Raise",
      "CampaignType",
      "Account Closure",
      "Configurations",
      "Promotions Creation",
      "Customer Schemes",
      "Delisted Schemes",
      "Amount Payble",
      "Customer List",
      "Payment Mode Ledger"
    ]

    console.log("🚀 Seeding user access started...");

    const rolesCollection = db.collection("userroles");
    const submenuCollection = db.collection("submenusettings");
    const accessCollection = db.collection("accesses");

    const roleData = await rolesCollection.findOne({ id_role: 2 });
    if (!roleData) {
      console.log("❌ Role not found (id_role: 2). Seeder stopped.");
      return;
    }

    const digiSilverEnabled = process.env.DIGI_SILVER === 'true';
    const digiGoldEnabled = process.env.DIGI_GOLD === 'true';
    const ecom = process.env.ECOM === 'true';

    if (digiGoldEnabled) {
      menuData.push("Digi Gold")
    }

    if(digiSilverEnabled){
      menuData.push("Digi Silver")
    }

    if(ecom){
      const  ecomMenu= ["Stone Master","State Master","Pincode","Size Master","Sub Category","Order Details","Orders","Stock Report","Top Selling Product","Payment History"]
      menuData.push(...ecomMenu)
    }

    for (let menu of menuData) {
      const submenu = await submenuCollection.findOne({
        submenu_name: menu,
      });

      if (!submenu) {
        console.log("❌ Submenu not found (subsubmenu_name: 'User Access'). Seeder stopped.");
        return;
      }

      const dataToInsert = {
        id_role: roleData._id,
        id_submenu: submenu._id,
        view_permit: true,
        add_permit: true,
        edit_permit: true,
        delete_permit: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const alreadyExists = await accessCollection.findOne({
        id_role: roleData._id,
        id_submenu: submenu._id,
      });

      if (alreadyExists) {
        console.log("⚠️ Access already exists for this role + submenu. Skipping insert.");
        return;
      }

      await accessCollection.insertOne(dataToInsert);
    }
    console.log("✅ User access seeded successfully!");
  } catch (error) {
    console.error("🔥 Error while seeding user access:", error.message);
    throw error;
  }
};
