class ClassificationController{
  constructor(classificationUseCase,validator){
    this.classificationUseCase = classificationUseCase;
    this.validator = validator;
  }

  async addSchemeClassification(req, res) {
    const {
      name,
      description
    } = req.body;

    try {
      if (!name || name === "") {
        return res
          .status(400)
          .json({
            status: "Failed",
            message: "Classification Name is required",
          });
      }  else if (!description || description === "") {
        return res
          .status(400)
          .json({ status: "Failed", message: "Description is required" });
      }

      req.body.created_by = req?.user?.id_employee;

      let classifcationImg = "";

      if (req.files) {
        if (req.files.classifcationImg) {
          classifcationImg = req.files.classifcationImg[0];
        }
      }

      const result = await this.classificationUseCase.addSchemeClassification(
        req.body,
        classifcationImg
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(201).json({ message: result.message });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateClassification(req, res) {
    const { id } = req.params;

    const {
      name,
      description
    } = req.body;

    try {
      if (!name || name === "") {
        return res
          .status(400)
          .json({
            status: "Failed",
            message: "Classification Name is required",
          });
      } else if (!description || description === "") {
        return res
          .status(400)
          .json({ status: "Failed", message: "Description is required" });
      }

      req.body.created_by = req?.user?.id_employee;
      const data = req.body;

      let classifcationImg = "";

      if (req.files) {
        if (req.files.classifcationImg) {
          classifcationImg = req.files.classifcationImg[0];
        }
      }
      const result = await this.classificationUseCase.updateClassification(
        id,
        data,
        classifcationImg
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getClassificationById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Classification ID is required" });
    }

    const result = await this.classificationUseCase.findById(id);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: result.message, data: result.data });
  }

  async deleteClassification(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Classification ID is required" });
      }

      const result = await this.classificationUseCase.deleteClassification(id);

      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async toggleActiveStatus(req,res){
    try {
      const {id}= req.params
       if(!id){
        return res.status(400).json({message:"Classification ID required"})
       }

       const result= await this.classificationUseCase.toggleActiveStatus(id);

       if(!result.success){
        return res.status(400).json({message:result.message});
       }

       res.status(200).json({message:result.message})
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:"Internal server error"})
    }
  }

  async getAllActiveClassifications(req,res){
    try {
       const result= await this.classificationUseCase.getAllActiveClassifications();

       if(!result.success){
        return res.status(400).json({message:result.message,data:[]});
       }

       res.status(200).json({message:result.message,data:result.data})
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:"Internal server error"})
    }
  }


  async getSchemeClassification(req, res) {
    try {
      const result = await this.classificationUseCase.getSchemeClassification();
  
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
  
      res.status(200).json({ message: result.message, data: result.data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({message:"Internal server error"})
    }
  }
}

export default ClassificationController;