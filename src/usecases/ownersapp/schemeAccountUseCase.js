class SchemeAccountUseCase {
    constructor(schemeAccountRepo) {
        this.schemeAccountRepo = schemeAccountRepo;
    }

    async executeGetSchemeAccounts(fromDate, toDate) {
        return await this.schemeAccountRepo.getSchemeAccounts(fromDate, toDate);
    }
}

export default SchemeAccountUseCase;
