class SchemeUseCase {
    constructor(schemeRepo) {
        this.schemeRepo = schemeRepo;
    }

    async getSchemeCount(query) {
        return await this.schemeRepo.getSchemeCount(query);
    }

    async getSchemeDetails(query) {
        return await this.schemeRepo.getSchemeDetails(query);
    }
}

export default SchemeUseCase;
