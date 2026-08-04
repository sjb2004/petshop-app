const prisma = require('./lib/prisma');

async function main() {
  const category = await prisma.category.create({
    data: { name: 'Dog Food' }
  });
  console.log('Created:', category);
}

main()
  .catch(console.error)
  .finally(() => process.exit());