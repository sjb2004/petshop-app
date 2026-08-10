const prisma = require('../lib/prisma');

// Get all products (public) — supports optional filters
async function getProducts(req, res) {
  try {
    const { categoryId, petType, search } = req.query;

    const filters = { isActive: true };
    if (categoryId) filters.categoryId = categoryId;
    if (petType) filters.petType = petType;
    if (search) filters.name = { contains: search, mode: 'insensitive' };

    const products = await prisma.product.findMany({
      where: filters,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// Get single product by ID (public)
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// Create product (admin only)
async function createProduct(req, res) {
  try {
    const { name, description, price, stock, imageUrl, petType, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price, and categoryId are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
        petType,
        categoryId,
      },
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// Update product (admin only)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, petType, categoryId, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(petType !== undefined && { petType }),
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// Delete product (admin only)
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};