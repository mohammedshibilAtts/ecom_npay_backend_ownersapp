class LoginUseCase {
  constructor(userRepository,hashingService,tokenService,layoutRepository,userAccessRepo,employeeRepo) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
    this.tokenService= tokenService;
    this.layoutRepository= layoutRepository;
    this.userAccessRepo=userAccessRepo;
    this.employeeRepo=employeeRepo;
  }

  async findByUsername(username, password) {
    const user = await this.userRepository.findByUser(username);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const validPassword = await this.hashingService.comparePassword(password, user.password);
    if (!validPassword) {
      return { success: false, message: 'Invalid password'};
    }

    if (user.active !== true && user.id_role.id_role !== 1) {
      return { success: false, message: 'User is deactivated'};
    }

    const menuData = await this.userAccessRepo.getActiveMenuAccess(user.id_role._id)
    const layoutsetting = await this.layoutRepository.getSettingByBranch(user.id_branch || user.access_branch)
    
    let color ='#FF5732'
    if(layoutsetting && layoutsetting.length> 0){
      color = layoutsetting[0].layout_color
    }

    let payload = {
      id:user._id,
      id_employee: user?.id_employee,
      branch:user?.access_branch,
      id_branch:user?.id_branch,
      layoutcolor:color,
      id_role:{
        _id:user?.id_role?._id,
        id_role:user?.id_role?.id_role
      }
    }

     if(user.username === "admin"){
      payload.roleNumber = 2;
    }else if(user.username === "superadmin"){
      payload.roleNumber = 1;
    }else{
      payload.roleNumber = 3;
    }

    if(user?.id_employee){
      const employee = await this.employeeRepo.findOne({_id:user.id_employee});
      payload.employee = employee?.firstname || 'Admin';
    }

    const token = this.tokenService.generateToken(payload);
    return { success: true, message: 'Login successful', token,menuData};
  }

  async findByAdmin(email, password) {
    const Data = await this.userRepository.findByEmail(email);

    if (!Data) {
      return { success: false, message: 'Admin not found' };
    }

    const validPassword = await this.hashingService.comparePassword(password, Data.password);
    if (!validPassword) {
      return { success: false, message: 'Invalid password or Email' };
    }

    if (Data.active !== 1) {
      return { success: false, message: 'Deactivated' };
    }
    let payload = {
      role:Data.is_admin
    }
    const token = this.tokenService.generateToken(payload);
    return { success: true, message: 'Login successful', token};
  }
}

export default LoginUseCase; 