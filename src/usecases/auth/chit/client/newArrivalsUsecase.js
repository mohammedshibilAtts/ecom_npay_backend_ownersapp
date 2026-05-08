import mongoose, { isValidObjectId } from "mongoose";
import s3Helper from "../../../../utils/s3Helper.js";

class NewArrivalUseCase {
  constructor(newArrivalRepository,branchRepository, s3service,s3rRepo) {
    this.newArrivalRepository = newArrivalRepository;
    this.branchRepository=branchRepository
    this.s3service = s3service;
    this.s3rRepo=s3rRepo
  }

  async addNewArrivals(newArrivalData, image_files = false) {
    try {
      if (!isValidObjectId(newArrivalData.id_product)) {
        return { success: false, message: "Provide a valid Product ID" };
      }
  
      if (!isValidObjectId(newArrivalData.id_branch)) {
        return { success: false, message: "Provide a valid Branch ID" };
      }
  
      const exisitingBranch = await this.branchRepository.findById(newArrivalData.id_branch);
      if (!exisitingBranch) {
        return { success: false, message: "Branch not found" };
      }
  
      const saveNewArrivals = await this.newArrivalRepository.addNewArrivals(newArrivalData);
      if (saveNewArrivals) {
        return { success: true, message: "New arrivals added successfully" };
      } else {
        return { success: false, message: "Failed to add new arrivals" };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while adding new arrivals.",
        error: err.message,
      };
    }
  }  

  async editNewArrivals(id, newArrivalData, image_files = false) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }
      if (newArrivalData.id_branch && !isValidObjectId(newArrivalData.id_branch)) {
        return { success: false, message: "Provide a valid Branch ID" };
      }
      if (newArrivalData.id_product && !isValidObjectId(newArrivalData.id_product)) {
        return { success: false, message: "Provide a valid Product ID" };
      }
  
      const existingNewArrival = await this.newArrivalRepository.findById(id);

      if (!existingNewArrival) {
        return { success: false, message: "New Arrivals not found" };
      }
  
      const updateFields = {};
      for (let key in newArrivalData) {
        if (key === "id_branch" || key === "id_product") {
          if (
            !new mongoose.Types.ObjectId(newArrivalData[key]).equals(
              new mongoose.Types.ObjectId(existingNewArrival[key])
            )
          ) {
            updateFields[key] = newArrivalData[key];
          }
        } else if (
          newArrivalData[key] !== existingNewArrival[key] &&
          newArrivalData[key] !== undefined
        ) {
          updateFields[key] = newArrivalData[key];
        }
      }
  
      if (Object.keys(updateFields).length === 0) {
        return { success: false, message: "No changes found." };
      }
  
      if (updateFields.id_branch) {
        const existingBranch = await this.branchRepository.findById(newArrivalData.id_branch);
        if (!existingBranch) {
          return { success: false, message: "Branch not found" };
        }
      }

  
      const updateNewArrivals = await this.newArrivalRepository.editNewArrivals(id, updateFields);
  
      if (updateNewArrivals) {
        return { success: true, message: "New arrivals updated successfully" };
      }
      return { success: false, message: "Failed to update new arrivals" };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while Editing new arrivals.",
        error: err.message,
      };
    }
  }
  


  async deleteNewArrivals(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }

      const checkNewArrivals = await this.newArrivalRepository.findById(id);
      if (!checkNewArrivals) {
        return { success: false, message: "New arrivals not found" };
      }

      const deleteNewArrivals =
        await this.newArrivalRepository.deleteNewArrivals(id);
      if (deleteNewArrivals) {
        return { success: true, message: "New arrivals deleted successfully" };
      } else {
        return { success: false, message: "Failed to delete new arrivals" };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while deleting new arrivals.",
        error: err.message,
      };
    }
  }

  async changeStatus(id) {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, message: "Provide a valid object ID" };
      }

      const checkNewArrivals = await this.newArrivalRepository.findById(id);
      if (!checkNewArrivals) {
        return { success: false, message: "New arrivals not found" };
      }
      const changeStatus = await this.newArrivalRepository.changeStatus(
        id,
        checkNewArrivals.active
      );
      if (!changeStatus) {
        return { success: false, message: "Failed to change status" };
      }

      let message = checkNewArrivals.active
        ? "New arrivals deactivated successfully"
        : "New arrivals activated successfully";
      return { success: true, message: message };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while changing new arrivals status.",
        error: err.message,
      };
    }
  }

  async findByBranchId(id){
    try{

      if(!isValidObjectId(id)){
        return {success:false,message:"Provide a valid object ID"}
      }

      const exisitingBranch=await this.branchRepository.findById(id)
      if(!exisitingBranch){
        return {success:false,message:"Branch not found"}
      }
      const result=await this.newArrivalRepository.findByBranchId(id)
      if(!result){
        return {success:false,message:"New arrival not found"}
      }
  
      return {success:true,message:"New arrival retrieved successfully",data:result}
    }catch(err){
      console.error(err);
      return {
        success: false,
        message: "An error occurred while get new arrivals by branch id.",
        error: err.message,
      };
    }
  }

  async findById(id) {
    try {
      if(!isValidObjectId(id)){
        return {success:false,message:"Provide Valid Object ID"}
      }

      const checkOffer=await this.newArrivalRepository.findById(id)
      if(!checkOffer){
        return {success:false,message:"New arrival not found"}
      }
      
      return {success:true,message:"New arrival retrieved successfully",data:checkOffer}

    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred while get new arrivals by id.",
        error: err.message,
      };
    }
  }

   async getNewArrivals(query,token) {
      try {
        let customerId= ""
        if(token){
          customerId = token._id
        }

        const { page, limit, from_date, to_date, id_branch, search,active,mobile} = query;
       
        const pageNum = page ? parseInt(page) : 1;
        const pageSize = limit ? parseInt(limit) : 10;
        const skip = (pageNum - 1) * pageSize;
        const filter = { is_deleted: false};

        if(mobile){
          filter.active = true
        }
  
  
        if (from_date && to_date) {
          const startDate = new Date(from_date);
          const endDate = new Date(to_date);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date format.");
          }
  
          filter.createdAt = {
            $gte: startDate, 
            $lte: endDate,
          };
        }
  
        if (isValidObjectId(id_branch)) {
          filter.id_branch = id_branch
        }
  
        if (search) {
          const searchRegex = new RegExp(search, "i"); 
          filter.$or = [{ 'id_product.product_name': { $regex: searchRegex } }];
        }
        
        if (active !== null && active !== undefined && active !== "") {
          filter.active = active;
        }

        const newArrivals = await this.newArrivalRepository.getNewArrivals(
          filter,
          skip,
          pageSize,
          customerId
        );
        if (!newArrivals.length >= 1) {
          return { success: false, message: "No new arrivals found" };
        }

        const totalnewArrivals = await this.newArrivalRepository.countNewArrivals(filter);
  
        return {
          success: true,
          message: "newArrivals retrieved successfully",
          data: {
            newArrivals,
            totalnewArrivals,
          totalPages: Math.ceil(totalnewArrivals / pageSize),
          currentPage: pageNum
          }
        };
      } catch (err) {
        console.error(err);
        return {
          success: false,
          message: "An error occurred while get new arrivals",
          error: err.message,
        };
      }
    }

}

export default NewArrivalUseCase;
