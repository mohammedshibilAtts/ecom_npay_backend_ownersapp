class CommonUseCase {
    constructor(commonRepo) {
        this.commonRepo = commonRepo;
    }

    async getGender() {
        try {
            return await this.commonRepo.getGender();
        } catch (error) {
            console.error("Error in getGender usecase:", error);
            throw error;
        }
    }

    async getBranch() {
        try {
            return await this.commonRepo.getBranch();
        } catch (error) {
            console.error("Error in getBranch usecase:", error);
            throw error;
        }
    }

    async getActiveCategory() {
        try {
            return await this.commonRepo.getActiveCategory();
        } catch (error) {
            console.error("Error in getActiveCategory usecase:", error);
            throw error;
        }
    }

    async getSubcategoryByCategory(categoryId) {
        try {
            return await this.commonRepo.getSubcategoryByCategory(categoryId);
        } catch (error) {
            console.error("Error in getSubcategoryByCategory usecase:", error);
            throw error;
        }
    }

    async getMetal() {
        try {
            return await this.commonRepo.getMetal();
        } catch (error) {
            console.error("Error in getMetal usecase:", error);
            throw error;
        }
    }

    async getPurityByMetalId(metalId) {
        try {
            return await this.commonRepo.getPurityByMetalId(metalId);
        } catch (error) {
            console.error("Error in getPurityByMetalId usecase:", error);
            throw error;
        }
    }

    async getSchemeTypes() {
        try {
            return await this.commonRepo.getSchemeTypes();
        } catch (error) {
            console.error("Error in getSchemeTypes usecase:", error);
            throw error;
        }
    }

    async getWastageType() {
        try {
            return await this.commonRepo.getWastageType();
        } catch (error) {
            console.error("Error in getWastageType usecase:", error);
            throw error;
        }
    }

    async getFundType() {
        try {
            return await this.commonRepo.getFundType();
        } catch (error) {
            console.error("Error in getFundType usecase:", error);
            throw error;
        }
    }

    async getInstallmentType() {
        try {
            return await this.commonRepo.getInstallmentType();
        } catch (error) {
            console.error("Error in getInstallmentType usecase:", error);
            throw error;
        }
    }

    async getClassifications() {
        try {
            return await this.commonRepo.getClassifications();
        } catch (error) {
            console.error("Error in getClassifications usecase:", error);
            throw error;
        }
    }
}

export default CommonUseCase;
