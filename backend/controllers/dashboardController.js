const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

exports.getStats = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Cancelled" } });

    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    const itemMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { name: item.name, totalQuantity: 0, totalSales: 0 };
        }
        itemMap[item.name].totalQuantity += item.quantity;
        itemMap[item.name].totalSales += item.price * item.quantity;
      });
    });

    const topSellingItems = Object.values(itemMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    const menuItems = await MenuItem.find();
    const categoryLookup = {};
    menuItems.forEach(m => { categoryLookup[m.name] = m.category; });

    const categoryMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = categoryLookup[item.name] || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.quantity);
      });
    });

    const categoryWiseSales = Object.keys(categoryMap).map(category => ({
      category,
      totalRevenue: categoryMap[category]
    }));

    res.json({
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      totalOrdersAllTime: orders.length,
      totalRevenueAllTime: orders.reduce((sum, o) => sum + o.grandTotal, 0),
      topSellingItems,
      categoryWiseSales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
