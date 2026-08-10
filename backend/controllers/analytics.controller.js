const prisma = require('../lib/prisma');

async function getDashboardStats(req, res) {
  try {
    // Total revenue and order count
    const orders = await prisma.order.findMany({
      include: { items: true },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Best-selling products
    const orderItems = await prisma.orderItem.findMany({
      include: { product: true },
    });

    const salesByProduct = {};
    for (const item of orderItems) {
      const id = item.productId;
      if (!salesByProduct[id]) {
        salesByProduct[id] = {
          productId: id,
          name: item.product.name,
          quantitySold: 0,
          revenue: 0,
        };
      }
      salesByProduct[id].quantitySold += item.quantity;
      salesByProduct[id].revenue += item.price * item.quantity;
    }

    const bestSellers = Object.values(salesByProduct)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    // Low stock products (threshold: 5 units)
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      select: { id: true, name: true, stock: true },
    });

    // Orders by status
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    res.json({
      totalOrders,
      totalRevenue,
      bestSellers,
      lowStockProducts,
      statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count.status })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { getDashboardStats };