import customerUseCase from "../../../src/usecases/auth/chit/client/CustomerUseCase.js";
import CustomerRepository from "../../infrastructure/repositories/chit/CustomerRepository.js";
import S3BucketRepository from "../../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";
import SmsSettingRepository from "../../infrastructure/repositories/chit/super/smsSettingRepository.js";
import smsService from "../../config/chit/smsService.js";


class CustomerUseCase {
    constructor(customerRepo) {
        this.customerRepo = customerRepo;
        this.S3BucketRepository = new S3BucketRepository();
        this.smsSettingRepository = new SmsSettingRepository();
        this.smsService = smsService;
        this.customerUseCase = new customerUseCase(new CustomerRepository(), null, this.S3BucketRepository, this.smsService, this.smsSettingRepository, null, null, null);
    }

    async getCustomers(query) {
        try {
            return await this.customerRepo.getCustomers(query);
        } catch (error) {
            console.error("Error in getCustomers usecase:", error);
            throw error;
        }
    }

    async setCustomers(query) {
        try {
            const s3Data = await this.S3BucketRepository.getSetting();
            if (s3Data) {
                const token = {
                    id_client: s3Data?.id_client
                }

                return await this.customerUseCase.addCustomer(query, null, token)
            }
            return await this.customerUseCase.addCustomer(query, null, null)
        } catch (error) {
            console.error("Error in setCustomers usecase:", error);
            throw error;
        }
    }

    async findCustomer(query) {
        try {
            console.log(query)
            const data = await this.customerRepo.findCustomer(query.mobile);

            let message = "Customer not found"

            if (data) {
                message = "Customer found"
            }

            if (!data?.active) {
                message = "Customer is not active"
            }

            return {
                success: true,
                message: message,
                data
            }
        } catch (error) {
            console.error("Error in findCustomer usecase:", error);
            throw error;
        }
    }

    async searchCustomerByMobileAndBranch(branchId, search) {
        try {
            return await this.customerUseCase.searchCustomerByMobileAndBranch(branchId, search);
        } catch (error) {
            console.error("Error in searchCustomerByMobileAndBranch usecase:", error);
            throw error;
        }
    }
}

export default CustomerUseCase;
