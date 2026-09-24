import ActualSchemeUseCase from "../auth/chit/client/SchemeUseCase.js";
import SchemeRepository from "../../infrastructure/repositories/chit/schemeRepository.js";
import MetalRepository from "../../infrastructure/repositories/chit/MetalRepository.js";
import PurityRespository from "../../infrastructure/repositories/chit/purityReporsitory.js";
import S3BucketRepository from "../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";
import S3Service from "../../utils/s3Bucket.js";

class SchemeUseCase {
    constructor(schemeRepo, actualSchemeUseCase) {
        this.schemeRepo = schemeRepo;
        this.actualSchemeUseCase = actualSchemeUseCase || new ActualSchemeUseCase(
            new SchemeRepository(),
            new MetalRepository(),
            new PurityRespository(),
            new S3BucketRepository(),
            new S3Service()
        );
    }

    async getSchemeCount(query) {
        return await this.schemeRepo.getSchemeCount(query);
    }

    async getSchemeDetails(query) {
        return await this.schemeRepo.getSchemeDetails(query);
    }

    async addScheme(schemeData, logo, desc_img) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.addScheme(schemeData, logo, desc_img);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async schemesTableData(filter, page, limit) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.schemesTableData(filter, page, limit);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async toggleSchemeStatus(id) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.toggleSchemeStatus(id);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async getDelistSchemes(filter, page, limit) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.getDelistSchemes(filter, page, limit);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async getSchemeByclassificationId(classId) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.getSchemeByclassificationId(classId);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async getSchemeById(id) {
        if (this.actualSchemeUseCase) {
            return await this.actualSchemeUseCase.getSchemeById(id);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }
}


export default SchemeUseCase;
