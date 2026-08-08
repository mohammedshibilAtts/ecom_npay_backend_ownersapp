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
}

export default CommonUseCase;
