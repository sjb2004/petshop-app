require('dotenv').config();
const prisma = require('./lib/prisma');

async function main() {
  const result = await prisma.category.deleteMany({
    where: { name: 'Dog Food' }
  });
  console.log('Deleted:', result);
}

main()
  .catch(console.error)
  .finally(() => process.exit());