class ChatbotController {
  constructor(chatbotUsecase) {
    this.chatbotUsecase = chatbotUsecase;
  }

  async createNode(req, res) {
    try {
      const data = req.body;
      const result = await this.chatbotUsecase.createNode(data);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getRootNodes(req, res) {
    try {
      const result = await this.chatbotUsecase.getRootNodes();
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getNodeById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.chatbotUsecase.getNodeById(id);
      if (!result) {
        return res.status(404).json({ success: false, message: "Node not found" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addOption(req, res) {
    try {
      const { id } = req.params;
      const optionData = req.body;
      const result = await this.chatbotUsecase.addOptionToNode(id, optionData);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllNodes(req, res) {
    try {
      const result = await this.chatbotUsecase.getAllNodes();
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateNode(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await this.chatbotUsecase.updateNode(id, data);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteNode(req, res) {
    try {
      const { id } = req.params;
      await this.chatbotUsecase.deleteNode(id);
      return res.status(200).json({ success: true, message: "Node deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default ChatbotController;
