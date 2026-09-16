class EmployeeUseCase {
  constructor(actualEmployeeUseCase) {
    this.actualEmployeeUseCase = actualEmployeeUseCase;
  }

  async addEmployee(data, uploads, user) {
    return await this.actualEmployeeUseCase.addEmployee(data, uploads, user);
  }

  async editEmployee(id, data, uploads, user) {
    return await this.actualEmployeeUseCase.editEmployee(id, data, uploads, user);
  }

  async deleteEmployee(id) {
    return await this.actualEmployeeUseCase.deleteEmployee(id);
  }

  async activateEmployee(id) {
    return await this.actualEmployeeUseCase.activateEmployee(id);
  }

  async getAllEmployees(page, limit, search) {
    return await this.actualEmployeeUseCase.getAllEmployees(page, limit, search);
  }

  async getEmployeeById(id) {
    return await this.actualEmployeeUseCase.getEmployeeById(id);
  }
}

export default EmployeeUseCase;
