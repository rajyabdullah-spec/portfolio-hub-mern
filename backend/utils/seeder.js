const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'Portfolio Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });

      console.log(`[SEED] Initial Admin account created: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`[SEED ERROR] Failed to seed admin user: ${error.message}`);
  }
};

module.exports = seedAdminUser;