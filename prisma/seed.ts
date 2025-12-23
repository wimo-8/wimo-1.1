import { PrismaClient, ProductType, PublishStatus, SellerStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const superAdminPhone = '07739543662';
  const adminUser = await prisma.user.upsert({
    where: { phone: superAdminPhone },
    update: {},
    create: {
      phone: superAdminPhone,
      name: 'موسى الحيدري',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'SUPER_ADMIN' },
  });

  const permissions = [
    'manage_catalog',
    'manage_orders',
    'manage_payments',
    'manage_settings',
    'manage_users',
  ];
  for (const key of permissions) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
  }

  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: { connect: permissions.map((key) => ({ key })) },
      users: { connect: { id: adminUser.id } },
    },
  });

  const categories = [
    { name: 'تصاميم سوشال ميديا', slug: 'social-design' },
    { name: 'مفاتيح برمجيات', slug: 'software-keys' },
    { name: 'تطوير مواقع', slug: 'web-dev' },
    { name: 'تطبيقات موبايل', slug: 'mobile-app' },
    { name: 'خدمات تقنية', slug: 'tech-services' },
  ];
  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }

  const sampleProducts = Array.from({ length: 10 }).map((_, idx) => ({
    title: `منتج رقمي ${idx + 1}`,
    description: 'خدمة/منتج رقمي جاهز للتسليم السريع',
    price: 20 + idx,
    type: idx % 3 === 0 ? ProductType.DIGITAL_KEY : idx % 3 === 1 ? ProductType.ACCOUNT : ProductType.SERVICE,
    status: PublishStatus.PUBLISHED,
    fulfillmentHours: 2 + idx,
    categoryId: categories[idx % categories.length].slug,
  }));

  for (const product of sampleProducts) {
    const category = await prisma.category.findUnique({ where: { slug: product.categoryId } });
    if (!category) continue;
    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        type: product.type,
        status: product.status,
        fulfillmentHours: product.fulfillmentHours,
        categoryId: category.id,
        media: { create: [{ url: '/placeholder.svg', alt: product.title }] },
        stock: product.type === ProductType.DIGITAL_KEY ? { create: [{ encryptedKey: Buffer.from(`CODE-${product.title}`).toString('base64') }] } : undefined,
      },
    });
  }

  const seller = await prisma.sellerProfile.create({
    data: {
      userId: adminUser.id,
      displayName: 'موسى - مالك المنصة',
      bio: 'إدارة ومراجعة جميع العروض الرقمية',
      skills: ['ادارة', 'برمجة', 'تصميم'],
      status: SellerStatus.APPROVED,
    },
  });

  const services = [
    {
      title: 'تصميم شعار احترافي',
      description: 'شعار سريع مع تسليم ملفات كاملة',
      price: 75,
      type: ProductType.SERVICE,
    },
    {
      title: 'موقع متجر صغير',
      description: 'تطوير متجر بسيط خلال 72 ساعة',
      price: 250,
      type: ProductType.SERVICE,
    },
    {
      title: 'بكج هوية بصرية',
      description: 'هوية كاملة مع خطوط وألوان ودليل استخدام',
      price: 190,
      type: ProductType.SERVICE,
    },
  ];

  for (const svc of services) {
    await prisma.product.create({
      data: {
        title: svc.title,
        description: svc.description,
        price: svc.price,
        type: svc.type,
        status: PublishStatus.PUBLISHED,
        sellerId: seller.id,
        fulfillmentHours: 48,
        media: { create: [{ url: '/placeholder.svg', alt: svc.title }] },
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: 'payment.balance.instructions' },
    update: {},
    create: { key: 'payment.balance.instructions', value: 'حوّل الرصيد ودوّن رقم العملية هنا.' },
  });
  await prisma.setting.upsert({
    where: { key: 'payment.qi.instructions' },
    update: {},
    create: { key: 'payment.qi.instructions', value: 'تحويل عبر Qi وارفع صورة العملية.' },
  });
  await prisma.setting.upsert({
    where: { key: 'payment.transfer.instructions' },
    update: {},
    create: { key: 'payment.transfer.instructions', value: 'تحويل مصرفي أو محفظة رقمية مع صورة.' },
  });

  const demoProduct = await prisma.product.findFirst();
  if (demoProduct) {
    await prisma.order.create({
      data: {
        userId: adminUser.id,
        total: demoProduct.price,
        paymentMethod: PaymentMethod.BALANCE,
        status: OrderStatus.RECEIVED,
        items: {
          create: [{
            productId: demoProduct.id,
            quantity: 1,
            unitPrice: demoProduct.price,
          }],
        },
        timeline: {
          create: [{ status: OrderStatus.RECEIVED, message: 'تم استلام الطلب التجريبي' }],
        },
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
