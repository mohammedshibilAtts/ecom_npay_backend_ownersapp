class User {
  constructor({
    id_employee,
    username,
    password,
    active,
    id_role,
    access_branch
  }) {
    this.id_employee = id_employee;
    this.username = username;
    this.password = password;
    this.active = active;
    this.id_role = id_role;
    this.access_branch = access_branch;
  }
}

export default User; 