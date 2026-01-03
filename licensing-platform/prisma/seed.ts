import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateLicenseKey } from '../src/lib/licenseUtils';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('Created admin user:', admin.email);

  // Create a sample product
  const product = await prisma.product.upsert({
    where: { name: 'Sample Product' },
    update: {},
    create: {
      name: 'Sample Product',
      description: 'A sample product for testing the licensing platform',
      userId: admin.id
    }
  });

  console.log('Created product:', product.name);

  // Create some sample licenses
  const licenseTypes = ['PERMANENT', 'SUBSCRIPTION', 'TRIAL'];
  
  for (let i = 0; i < 5; i++) {
    const licenseKey = generateLicenseKey();
    const type = licenseTypes[i % licenseTypes.length];
    
    const license = await prisma.license.create({
      data: {
        key: licenseKey,
        productId: product.id,
        type: type as any,
        maxActivations: type === 'PERMANENT' ? 1 : null,
        expiresAt: type === 'SUBSCRIPTION' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : 
                   type === 'TRIAL' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
        userId: admin.id
      }
    });

    console.log(`Created ${type} license: ${license.key}`);
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });