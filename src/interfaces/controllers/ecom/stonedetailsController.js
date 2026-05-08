class stonedetailsController {
  constructor(usecase) {
    this.usecase = usecase;
  }

    async getById(req, res) {
    try {
        const { id }=req.params
      const data = await this.usecase.getById(id);
      if (!data) return res.status(404).json({ success: false, message: "Not found" });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

 async getManyByIds(req, res) {
  try {
    const { ids,type } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids must be a non-empty array" });
    }

    const stones = await this.usecase.getManyByIds(ids,type);
    res.status(200).json({ success: true, data: stones });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}



}


export default stonedetailsController;  