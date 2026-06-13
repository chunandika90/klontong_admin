import { AppDataSource } from '../data-source';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { User, UserRole } from '../../auth/entities/user.entity';

const categories = [
  { name: 'Snacks', description: 'Camilan dan makanan ringan' },
  { name: 'Minuman', description: 'Minuman kemasan dan segar' },
  { name: 'Sembako', description: 'Kebutuhan pokok sehari-hari' },
  { name: 'Kebersihan', description: 'Produk kebersihan rumah tangga' },
  { name: 'Personal Care', description: 'Perawatan diri' },
  { name: 'Susu & Dairy', description: 'Produk susu dan olahannya' },
  { name: 'Rokok', description: 'Produk tembakau' },
  { name: 'Frozen Food', description: 'Makanan beku' },
];

const productTemplates = [
  { name: 'Indomie Goreng', categoryIdx: 2, price: 3500, weight: 85, stock: 200 },
  { name: 'Indomie Kuah Ayam', categoryIdx: 2, price: 3000, weight: 75, stock: 150 },
  { name: 'Aqua 600ml', categoryIdx: 1, price: 4000, weight: 600, stock: 300 },
  { name: 'Aqua 1.5L', categoryIdx: 1, price: 6000, weight: 1500, stock: 200 },
  { name: 'Teh Botol Sosro 250ml', categoryIdx: 1, price: 5000, weight: 250, stock: 100 },
  { name: 'Coca Cola 330ml', categoryIdx: 1, price: 7000, weight: 330, stock: 80 },
  { name: 'Beras Premium 5kg', categoryIdx: 2, price: 75000, weight: 5000, stock: 50 },
  { name: 'Gula Pasir 1kg', categoryIdx: 2, price: 15000, weight: 1000, stock: 100 },
  { name: 'Minyak Goreng 1L', categoryIdx: 2, price: 20000, weight: 900, stock: 80 },
  { name: 'Ciki Ciki', categoryIdx: 0, price: 2000, weight: 50, stock: 300 },
  { name: 'Chitato Sapi Panggang', categoryIdx: 0, price: 10000, weight: 68, stock: 120 },
  { name: 'Pringles Original', categoryIdx: 0, price: 35000, weight: 158, stock: 60 },
  { name: 'Oreo Original', categoryIdx: 0, price: 8000, weight: 119, stock: 150 },
  { name: 'Ritz Crackers', categoryIdx: 0, price: 12000, weight: 200, stock: 90 },
  { name: 'Sabun Lifebuoy 85g', categoryIdx: 3, price: 5000, weight: 85, stock: 200 },
  { name: 'Rinso Matic 750g', categoryIdx: 3, price: 25000, weight: 750, stock: 70 },
  { name: 'Sunlight 800ml', categoryIdx: 3, price: 18000, weight: 800, stock: 80 },
  { name: 'Baygon Semprot 600ml', categoryIdx: 3, price: 32000, weight: 600, stock: 40 },
  { name: 'Shampo Pantene 170ml', categoryIdx: 4, price: 22000, weight: 170, stock: 60 },
  { name: 'Pasta Gigi Pepsodent', categoryIdx: 4, price: 10000, weight: 120, stock: 100 },
  { name: 'Susu Ultra 250ml', categoryIdx: 5, price: 5500, weight: 250, stock: 120 },
  { name: 'Susu Indomilk 1L', categoryIdx: 5, price: 18000, weight: 1000, stock: 80 },
  { name: 'Yakult 5 Pack', categoryIdx: 5, price: 15000, weight: 500, stock: 90 },
  { name: 'Energen Vanila', categoryIdx: 5, price: 3500, weight: 30, stock: 200 },
  { name: 'Nugget So Good 500g', categoryIdx: 7, price: 35000, weight: 500, stock: 50 },
  { name: 'Sosis So Nice 375g', categoryIdx: 7, price: 18000, weight: 375, stock: 60 },
  { name: 'Beng-beng', categoryIdx: 0, price: 4000, weight: 35, stock: 200 },
  { name: 'Silver Queen 65g', categoryIdx: 0, price: 15000, weight: 65, stock: 80 },
  { name: 'Tango Wafer 176g', categoryIdx: 0, price: 12000, weight: 176, stock: 100 },
  { name: 'Sprite 330ml', categoryIdx: 1, price: 7000, weight: 330, stock: 80 },
  { name: 'Fanta Strawberry 330ml', categoryIdx: 1, price: 7000, weight: 330, stock: 70 },
  { name: 'Pocari Sweat 500ml', categoryIdx: 1, price: 8000, weight: 500, stock: 90 },
  { name: 'Mizone 500ml', categoryIdx: 1, price: 7000, weight: 500, stock: 100 },
  { name: 'Kopi Good Day 220ml', categoryIdx: 1, price: 5000, weight: 220, stock: 150 },
  { name: 'Nescafe 3in1', categoryIdx: 1, price: 3500, weight: 20, stock: 200 },
  { name: 'Teh Celup Sariwangi', categoryIdx: 1, price: 8000, weight: 50, stock: 100 },
  { name: 'Garam Refina 250g', categoryIdx: 2, price: 4000, weight: 250, stock: 150 },
  { name: 'Kecap Bango 135ml', categoryIdx: 2, price: 8000, weight: 135, stock: 120 },
  { name: 'Saos Sambal ABC 135ml', categoryIdx: 2, price: 7000, weight: 135, stock: 130 },
  { name: 'Tepung Terigu Segitiga 1kg', categoryIdx: 2, price: 13000, weight: 1000, stock: 80 },
  { name: 'Mie Sedaap Goreng', categoryIdx: 2, price: 3200, weight: 85, stock: 180 },
  { name: 'Royco Bumbu Ayam', categoryIdx: 2, price: 2500, weight: 8, stock: 200 },
  { name: 'Masako Sapi', categoryIdx: 2, price: 2500, weight: 8, stock: 200 },
  { name: 'Wipol Karbol 770ml', categoryIdx: 3, price: 15000, weight: 770, stock: 60 },
  { name: 'Molto Pewangi 800ml', categoryIdx: 3, price: 22000, weight: 800, stock: 50 },
  { name: 'Pepsodent Sikat Gigi', categoryIdx: 4, price: 8000, weight: 20, stock: 100 },
  { name: 'Gatsby Wax 75g', categoryIdx: 4, price: 25000, weight: 75, stock: 40 },
  { name: 'Nivea Body Lotion 100ml', categoryIdx: 4, price: 30000, weight: 100, stock: 50 },
  { name: 'Emeron Shampo 170ml', categoryIdx: 4, price: 18000, weight: 170, stock: 60 },
  { name: 'Susu Dancow 400g', categoryIdx: 5, price: 45000, weight: 400, stock: 40 },
  { name: 'Milo 3in1 18g', categoryIdx: 5, price: 3000, weight: 18, stock: 200 },
  { name: 'Ovaltine 200g', categoryIdx: 5, price: 25000, weight: 200, stock: 60 },
  { name: 'Batagor Fiesta 500g', categoryIdx: 7, price: 28000, weight: 500, stock: 45 },
  { name: 'Dimsum Cedea 200g', categoryIdx: 7, price: 22000, weight: 200, stock: 55 },
  { name: 'Keju Prochiz 165g', categoryIdx: 5, price: 20000, weight: 165, stock: 60 },
  { name: 'Margarin Blue Band 200g', categoryIdx: 2, price: 12000, weight: 200, stock: 80 },
  { name: 'Minyak Goreng Bimoli 2L', categoryIdx: 2, price: 35000, weight: 1800, stock: 50 },
  { name: 'Terigu Cakra Kembar 1kg', categoryIdx: 2, price: 15000, weight: 1000, stock: 70 },
  { name: 'Kopi Kapal Api 165g', categoryIdx: 1, price: 18000, weight: 165, stock: 80 },
  { name: 'Teh Kotak 250ml', categoryIdx: 1, price: 5000, weight: 250, stock: 120 },
  { name: 'Ale-Ale Mangga 350ml', categoryIdx: 1, price: 5000, weight: 350, stock: 100 },
  { name: 'Minute Maid Pulpy 350ml', categoryIdx: 1, price: 7000, weight: 350, stock: 90 },
  { name: 'Lays Original 68g', categoryIdx: 0, price: 12000, weight: 68, stock: 100 },
  { name: 'Momogi Jagung Bakar', categoryIdx: 0, price: 3000, weight: 50, stock: 200 },
  { name: 'Richeese Nabati', categoryIdx: 0, price: 2500, weight: 35, stock: 250 },
  { name: 'Gery Chocolatos', categoryIdx: 0, price: 3000, weight: 24, stock: 200 },
  { name: 'Nissin Malkist Crackers', categoryIdx: 0, price: 8000, weight: 135, stock: 120 },
  { name: 'SilverQueen Chunky Bar', categoryIdx: 0, price: 20000, weight: 95, stock: 70 },
  { name: 'Toblerone 100g', categoryIdx: 0, price: 35000, weight: 100, stock: 40 },
  { name: 'Roma Sari Gandum', categoryIdx: 0, price: 5000, weight: 115, stock: 150 },
  { name: 'Khong Guan Assorted', categoryIdx: 0, price: 50000, weight: 700, stock: 30 },
  { name: 'Teh Pucuk Harum 350ml', categoryIdx: 1, price: 5000, weight: 350, stock: 130 },
  { name: 'Nu Green Tea 330ml', categoryIdx: 1, price: 6000, weight: 330, stock: 100 },
  { name: 'Goodday Capuccino', categoryIdx: 1, price: 5000, weight: 220, stock: 100 },
  { name: 'Susu UHT Frisian Flag 250ml', categoryIdx: 5, price: 6000, weight: 250, stock: 100 },
  { name: 'Cimory Yogurt 200ml', categoryIdx: 5, price: 12000, weight: 200, stock: 70 },
  { name: 'Nestle Koko Krunch', categoryIdx: 5, price: 35000, weight: 350, stock: 50 },
  { name: 'Sunsilk Shampo 170ml', categoryIdx: 4, price: 20000, weight: 170, stock: 70 },
  { name: 'Dove Body Wash 400ml', categoryIdx: 4, price: 45000, weight: 400, stock: 40 },
  { name: 'Axe Body Spray 150ml', categoryIdx: 4, price: 32000, weight: 150, stock: 50 },
  { name: 'Fair and Lovely 30g', categoryIdx: 4, price: 15000, weight: 30, stock: 80 },
  { name: 'Soffell Losion Nyamuk 100ml', categoryIdx: 4, price: 25000, weight: 100, stock: 60 },
  { name: 'Domestos Karbol 750ml', categoryIdx: 3, price: 20000, weight: 750, stock: 50 },
  { name: 'Harpic Pembersih WC 450ml', categoryIdx: 3, price: 25000, weight: 450, stock: 45 },
  { name: 'Super Pell Lantai 800ml', categoryIdx: 3, price: 18000, weight: 800, stock: 55 },
  { name: 'Tisu Paseo 250s', categoryIdx: 3, price: 18000, weight: 200, stock: 100 },
  { name: 'Tisu Basah Sensodyne 50s', categoryIdx: 3, price: 15000, weight: 150, stock: 80 },
  { name: 'Bihun Rose Brand 200g', categoryIdx: 2, price: 8000, weight: 200, stock: 100 },
  { name: 'Kacang Garuda 100g', categoryIdx: 0, price: 10000, weight: 100, stock: 120 },
  { name: 'Marjan Squash Cocopandan', categoryIdx: 1, price: 18000, weight: 460, stock: 70 },
  { name: 'Es Krim Walls Paddle Pop', categoryIdx: 7, price: 6000, weight: 60, stock: 80 },
  { name: 'Es Krim Campina 700ml', categoryIdx: 7, price: 45000, weight: 700, stock: 30 },
  { name: 'Indomie Rendang', categoryIdx: 2, price: 3500, weight: 85, stock: 160 },
  { name: 'Kopi Torabika 3in1', categoryIdx: 1, price: 3000, weight: 20, stock: 200 },
  { name: 'Tropicana Slim 250ml', categoryIdx: 1, price: 6000, weight: 250, stock: 90 },
  { name: 'Nutrisari Orange', categoryIdx: 1, price: 3500, weight: 15, stock: 200 },
  { name: 'Mayonnaise Maestro 500ml', categoryIdx: 2, price: 28000, weight: 500, stock: 50 },
  { name: 'Sambal Indofood 140ml', categoryIdx: 2, price: 8000, weight: 140, stock: 120 },
  { name: 'Sarden ABC 155g', categoryIdx: 2, price: 12000, weight: 155, stock: 100 },
  { name: 'Kornet Pronas 198g', categoryIdx: 2, price: 15000, weight: 198, stock: 80 },
];

function generateSku(index: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sku = '';
  let n = index + 1;
  for (let i = 0; i < 6; i++) {
    sku += chars[n % chars.length];
    n = Math.floor(n / chars.length) + i + 1;
  }
  return sku;
}

export async function runSeed(dataSource = AppDataSource) {
  const shouldDestroy = !dataSource.isInitialized;
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const userRepo = dataSource.getRepository(User);

  const savedCategories: Category[] = [];
  for (const cat of categories) {
    let existing = await categoryRepo.findOne({ where: { name: cat.name } });
    if (!existing) {
      existing = await categoryRepo.save(categoryRepo.create(cat));
    }
    savedCategories.push(existing);
  }
  console.log(`Seeded ${savedCategories.length} categories`);

  let productCount = 0;
  for (let i = 0; i < productTemplates.length; i++) {
    const t = productTemplates[i];
    const sku = generateSku(i);
    const existing = await productRepo.findOne({ where: { sku } });
    if (!existing) {
      await productRepo.save(
        productRepo.create({
          sku,
          name: t.name,
          categoryId: savedCategories[t.categoryIdx].id,
          description: `${t.name} - produk berkualitas di toko klontong kami`,
          weight: t.weight,
          width: 10,
          length: 10,
          height: 10,
          image: `https://picsum.photos/seed/${sku}/300/300`,
          price: t.price,
          isActive: true,
          stock: t.stock,
        }),
      );
      productCount++;
    }
  }
  console.log(`Seeded ${productCount} new products`);

  const adminExists = await userRepo.findOne({ where: { email: 'admin@klontong.com' } });
  if (!adminExists) {
    await userRepo.save(userRepo.create({ email: 'admin@klontong.com', name: 'Admin Klontong', password: 'admin123', role: UserRole.ADMIN }));
  }
  const staffExists = await userRepo.findOne({ where: { email: 'staff@klontong.com' } });
  if (!staffExists) {
    await userRepo.save(userRepo.create({ email: 'staff@klontong.com', name: 'Staff Toko', password: 'staff123', role: UserRole.STAFF }));
  }
  console.log('Seeded users');

  if (shouldDestroy) await dataSource.destroy();
  console.log('Seeding complete.');
}

// Run directly (npm run seed)
runSeed().catch((e) => { console.error(e); process.exit(1); });
