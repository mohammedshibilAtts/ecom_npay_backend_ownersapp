class ChatbotUsecase {
  constructor(chatbotRepository) {
    this.chatbotRepository = chatbotRepository;
  }

  async createNode(data) {
    try {
      // Input validation can be added here
      if (![1, 2].includes(data.type)) {
        throw new Error("Invalid type. Must be 1 (Question) or 2 (Answer).");
      }
      return await this.chatbotRepository.createItem(data);
    } catch (error) {
      throw error;
    }
  }

  async getRootNodes() {
    try {
      return await this.chatbotRepository.findRootItems();
    } catch (error) {
      throw error;
    }
  }

  async getNodeById(id) {
    try {
      return await this.chatbotRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async addOptionToNode(nodeId, optionData) {
    try {
      const node = await this.chatbotRepository.findById(nodeId);
      if (!node) {
        throw new Error("Node not found");
      }
      if (node.type !== 1) {
        throw new Error("Cannot add options to an Answer node");
      }
      
      return await this.chatbotRepository.addOption(nodeId, optionData);
    } catch (error) {
      throw error;
    }
  }
}

export default ChatbotUsecase;
