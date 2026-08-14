const prisma = require('../lib/prisma');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getDashboardStats(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

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

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      select: { id: true, name: true, stock: true },
    });

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

async function getWeeklySummary(req, res) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      include: { items: { include: { product: true } } },
    });

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const previousWeekOrders = await prisma.order.findMany({
      where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } },
    });

    const thisWeekRevenue = recentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lastWeekRevenue = previousWeekOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const salesByProduct = {};
    for (const order of recentOrders) {
      for (const item of order.items) {
        const name = item.product.name;
        salesByProduct[name] = (salesByProduct[name] || 0) + item.quantity;
      }
    }

    const lowStock = await prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      select: { name: true, stock: true },
    });

    const dataSummary = {
      thisWeekOrders: recentOrders.length,
      thisWeekRevenue,
      lastWeekRevenue,
      topProducts: Object.entries(salesByProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => `${name}: ${qty} sold`),
      lowStock: lowStock.map((p) => `${p.name} (${p.stock} left)`),
    };

    if (recentOrders.length === 0) {
      return res.json({ summary: 'No orders were placed this week yet.' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `You are a business analyst summarizing weekly sales for a small local pet shop owner in India. Write a short, plain-English summary (3-4 sentences max) based on this data. Use ₹ (rupees) as the currency symbol, not dollars. Be direct and practical, highlight what's working and any concerns like low stock. Don't use markdown formatting.

          Data: ${JSON.stringify(dataSummary)}`,
          

        },
      ],
    });

    const summary = completion.choices[0].message.content;

    

    res.json({ summary, data: dataSummary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong generating the summary' });
  }
}

module.exports = { getDashboardStats, getWeeklySummary };