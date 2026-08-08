class LocationUseCase {
    constructor(locationRepo) {
        this.locationRepo = locationRepo;
    }

    async getCountry() {
        try {
            return await this.locationRepo.getCountry();
        } catch (error) {
            console.error("Error in getCountry usecase:", error);
            throw error;
        }
    }

    async getState(countryId) {
        try {
            return await this.locationRepo.getState(countryId);
        } catch (error) {
            console.error("Error in getState usecase:", error);
            throw error;
        }
    }

    async getCity(stateId) {
        try {
            return await this.locationRepo.getCity(stateId);
        } catch (error) {
            console.error("Error in getCity usecase:", error);
            throw error;
        }
    }
}

export default LocationUseCase;
