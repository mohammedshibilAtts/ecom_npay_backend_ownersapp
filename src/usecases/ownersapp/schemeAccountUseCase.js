class SchemeAccountUseCase {
    constructor(schemeAccountRepo, actualSchemeAccountUseCase, otpUseCase) {
        this.schemeAccountRepo = schemeAccountRepo;
        this.actualSchemeAccountUseCase = actualSchemeAccountUseCase;
        this.otpUseCase = otpUseCase;
    }

    async executeGetSchemeAccounts(fromDate, toDate) {
        return await this.schemeAccountRepo.getSchemeAccounts(fromDate, toDate);
    }

    async searchCustomerByMobile(branchId, mobile, state) {
        console.log({ branchId, mobile, state })
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.searchMobieSchemeAccount(branchId, mobile, state);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async customMobileSearch(id_branch, search_mobile, status) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.customMobileSearch(id_branch, search_mobile, status);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async sendOtpForClose(mobile, branchId, user) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.sendOtpForClose(mobile, branchId, user);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async verifyOtp(data) {
        if (this.otpUseCase) {
            return await this.otpUseCase.verifyOtp(data);
        }
        return { success: false, message: "OTP usecase not initialized" };
    }

    async closeSchemeAccount(id, data, user) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.closeSchemeAccount(id, data, user);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async getSchemeAccountTable(data) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.getSchemeAccountTable(data);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async getSchemeAccountById(id) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.getSchemeAccountById(id);
        }
        return { success: false, message: "Domain usecase not initialized" };
    }

    async addSchemeAccount(data, user) {
        if (this.actualSchemeAccountUseCase) {
            return await this.actualSchemeAccountUseCase.addSchemeAccount(data, { id_employee: "6884eb4319c02da61fc1d32b" });
        }
        return { success: false, message: "Domain usecase not initialized" };
    }
}


export default SchemeAccountUseCase;
