import config from "../../../../config/chit/env.js";
import s3Helper from "../../../../utils/s3Helper.js";

class OrganisationUsecase {
    constructor(organisationRepo,s3Service,s3Repo){
        this.organisationRepo = organisationRepo;
        this.s3Service= s3Service;
        this.s3Repo = s3Repo;
    }

      async addOrgDetails(data, token, files) {
        try {
            const existing = await this.organisationRepo.findOne();
    
            if (files) {
                const s3Configs = await s3Helper()
                const imageKeys = ["logo", "small_logo", "favicon", "login", "background", "bottom_logo"];
    
                for (const key of imageKeys) {
                    if (files[key] && files[key][0]) {
                        try {
                            if (existing && existing[key]) {
                                await this.s3Service.deleteFromS3(existing[key], s3Configs);
                            }
                            data[key] = await this.s3Service.uploadToS3(
                                files[key][0],
                                "organisation",
                                s3Configs
                            );
                        } catch (error) {
                            console.error(`Error handling ${key}:`, error);
                        }
                    }
                }
            }
    
            if (existing) {
                const updatedData = await this.organisationRepo.updateOne(existing._id, data);
    
                if (!updatedData) {
                    return { success: false, message: "Failed to update organisation details" };
                }
    
                return { success: true, message: "Organisation details updated successfully" };
            }
    
            const addData = await this.organisationRepo.insertOne(data);
    
            if (!addData) {
                return { success: false, message: "Failed to add organisation details" };
            }
    
            return { success: true, message: "Organisation details added successfully" };
        } catch (error) {
            console.error("Error while adding organisation details:", error);
            return { success: false, message: "Error while adding organisation details" };
        }
    }
    
    
    async getDetails(){
        try {
            const existsing  = await this.organisationRepo.findOne();

            if(existsing){
               existsing.whatsapp_no = `+91${existsing?.whatsapp_no}` || ""
               existsing.pathurl =  `${config.DISPLAY_IMG_URL}${config.AWS_LOCAL_PATH}organisation/`
               return {success:true,message:"Organisation detials fetched successfully",data:existsing}
            }

            return {success:false,message:"No organisation details found"}
        } catch (error) {
            console.error(error);
            return {success:false,message:"Error while adding organisation detials"}
        }
    }
}

export default OrganisationUsecase;