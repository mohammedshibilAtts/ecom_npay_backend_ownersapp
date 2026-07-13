import countryModel from "../../models/chit/countryModel.js";
import stateModel from "../../models/chit/stateModel.js";
import cityModel from "../../models/chit/cityModel.js";

class LocationRepo {
    async getCountry() {
        try {
            return await countryModel.find({}).sort({ country_name: 1 });
        } catch (error) {
            console.error("Error in getCountry:", error);
            throw error;
        }
    }

    async getState(countryId) {
        try {
            console.log(countryId)
            const query = countryId ? { id_country: countryId } : {};
            return await stateModel.find(query).sort({ state_name: 1 });
        } catch (error) {
            console.error("Error in getState:", error);
            throw error;
        }
    }

    async getCity(stateId) {
        try {
            if (!stateId) throw new Error("State ID is required");
            return await cityModel.find({ id_state: stateId }).sort({ city_name: 1 });
        } catch (error) {
            console.error("Error in getCity:", error);
            throw error;
        }
    }
}

export default LocationRepo;
