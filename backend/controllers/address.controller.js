const prisma = require('../lib/prisma');

// Create address (logged-in users only)
async function createAddress(req, res) {
  try {
    const userId = req.user.userId;
    const { label, line1, line2, city, state, pincode } = req.body;

    if (!label || !line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'All required address fields must be filled' });
    }

    const address = await prisma.address.create({
      data: { label, line1, line2, city, state, pincode, userId },
    });

    res.status(201).json({ message: 'Address created', address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// Get logged-in user's addresses
async function getMyAddresses(req, res) {
  try {
    const userId = req.user.userId;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { createAddress, getMyAddresses };