const dns = require('dns');
// Use reliable public DNS to prevent Windows ECONNREFUSED on SRV queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('Using system DNS');
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://peterkiprotichki_db_user:FyONfVf7VlHKuPuK@cluster0.hbo4kvh.mongodb.net/compass?retryWrites=true&w=majority&appName=Cluster0';

async function runSeed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to Atlas successfully!');

  const db = mongoose.connection.db;

  // 1. Seed Super Admins
  const usersCollection = db.collection('users');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('AdminCompass2026!', salt);

  const superAdmins = [
    {
      email: 'peterkiprotichki@gmail.com',
      name: 'Peter Kiprotich',
      role: 'super_admin',
      passwordHash: passwordHash,
      phone: '+254700000000',
      country: 'Kenya',
      language: 'en',
      authProvider: 'local',
      twoFactorChannel: 'email',
      savedPaths: [],
      updatedAt: new Date(),
    },
    {
      email: 'admin@compass.africa',
      name: 'Compass Super Admin',
      role: 'super_admin',
      passwordHash: passwordHash,
      phone: '+254700000000',
      country: 'Kenya',
      language: 'en',
      authProvider: 'local',
      twoFactorChannel: 'email',
      savedPaths: [],
      updatedAt: new Date(),
    }
  ];

  for (const admin of superAdmins) {
    const existing = await usersCollection.findOne({ email: admin.email });
    if (existing) {
      await usersCollection.updateOne(
        { email: admin.email },
        { 
          $set: { 
            role: 'super_admin', 
            passwordHash: passwordHash,
            name: admin.name,
            phone: admin.phone,
            updatedAt: new Date()
          } 
        }
      );
      console.log(`Updated Super Admin: ${admin.email}`);
    } else {
      admin.createdAt = new Date();
      await usersCollection.insertOne(admin);
      console.log(`Created Super Admin: ${admin.email}`);
    }
  }

  // 2. Seed Businesses
  const businessesCollection = db.collection('businesses');
  const { SEED_BUSINESSES } = require('./dist/modules/seed/seed.data');
  console.log(`Seeding ${SEED_BUSINESSES.length} African businesses...`);

  let count = 0;
  for (const biz of SEED_BUSINESSES) {
    await businessesCollection.updateOne(
      { slug: biz.slug },
      { $set: biz },
      { upsert: true }
    );
    count++;
  }
  console.log(`Successfully seeded/updated ${count} businesses in Atlas!`);

  const totalUsers = await usersCollection.countDocuments();
  const totalBusinesses = await businessesCollection.countDocuments();
  console.log(`Summary: Users in DB = ${totalUsers}, Businesses in DB = ${totalBusinesses}`);

  await mongoose.disconnect();
  console.log('Database seeding finished successfully!');
}

runSeed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
