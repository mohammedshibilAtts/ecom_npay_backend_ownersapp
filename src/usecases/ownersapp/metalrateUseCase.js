import metalRateUseCase from "../auth/chit/client/metalRateUseCase.js";
import MetalRateRepository from "../../infrastructure/repositories/chit/metalRateRepository.js";
class MetalRateUseCase {
    constructor(metalRateRepo) {
        this.metalRateRepo = metalRateRepo;
        this.metalrateUseCase = new metalRateUseCase(new MetalRateRepository());
    }

    async getMetalRate(branchId, date = null) {
        return await this.metalRateRepo.getMetalRate(branchId, date);
    }

    async setMetalRate(data) {
        return await this.metalrateUseCase.addMetalRate(data);
    }
}

export default MetalRateUseCase;
