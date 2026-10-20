const Table = require("../models/Table");

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
