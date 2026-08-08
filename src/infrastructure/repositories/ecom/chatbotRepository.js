import ChatbotItem from "../../models/ecom/chatbotModel.js";

class ChatbotRepository {
  async createItem(data) {
    const item = new ChatbotItem(data);
    return await item.save();
  }

  async findById(id) {
    return await ChatbotItem.findById(id).populate("options.nextId");
  }

  async findRootItems() {
    return await ChatbotItem.find({ isRoot: true }).populate("options.nextId");
  }

  async findAllItems() {
    return await ChatbotItem.find({}).populate("options.nextId");
  }

  async updateItem(id, updateData) {
    return await ChatbotItem.findByIdAndUpdate(id, updateData, { new: true });
  }

  async addOption(id, optionData) {
    return await ChatbotItem.findByIdAndUpdate(
      id,
      { $push: { options: optionData } },
      { new: true }
    ).populate("options.nextId");
  }

  async deleteItem(id) {
    return await ChatbotItem.findByIdAndDelete(id);
  }
}

export default ChatbotRepository;
