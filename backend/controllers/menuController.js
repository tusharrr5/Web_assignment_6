const MenuItem = require("../models/MenuItem");

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
