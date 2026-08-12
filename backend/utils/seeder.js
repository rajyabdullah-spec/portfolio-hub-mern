const User = require('../models/User');

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

      await User.create({
        name: 'Portfolio Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      console.log(`[SEED] Initial Admin account created: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`[SEED ERROR] Failed to seed admin user: ${error.message}`);
  }
};

module.exports = seedAdminUser;