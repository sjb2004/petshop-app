require('dotenv').config();
const prisma = require('./lib/prisma');

async function main() {
  const address = await prisma.address.create({
    data: {
      label: 'Home',
      line1: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      userId: 'eb1567ee-3668-4017-b1b8-cd33a4693efc',
    },
  });
  console.log('Created address:', address);
}

main()
  .catch(console.error)
  .finally(() => process.exit());