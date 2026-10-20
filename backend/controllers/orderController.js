const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

exports.placeOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    let subtotal = 0;
    let orderItems = [];

    for (let item of items) {
      let dbItem = null;
      if (item.menuItem) {
        dbItem = await MenuItem.findById(item.menuItem).catch(() => null);
      }
      if (!dbItem && item.name) {
        dbItem = await MenuItem.findOne({ name: item.name });
      }

      if (!dbItem || !dbItem.isAvailable) {
        return res.status(400).json({
          message: `${dbItem ? dbItem.name : (item.name || "Item")} is unavailable and cannot be ordered`
        });
      }

      subtotal += dbItem.price * item.quantity;
      orderItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        quantity: item.quantity,
        price: dbItem.price
      });
    }

    const gst = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gst;

    const order = await Order.create({
      customer: req.user.userId,
      customerName: req.user.name,
      tableNumber,
      items: orderItems,
      subtotal,
      gst,
      grandTotal,
      status: "Placed"
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Placed") {
      return res.status(400).json({ message: "Cannot cancel order once it is preparing or served" });
    }

    order.status = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
