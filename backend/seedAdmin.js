const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv/config");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully!");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists with email:", existingAdmin.email);
      return;
    }

    // Create admin credentials
    const adminEmail = "admin@hospital.com";
    const adminPassword = "admin123";
    const adminName = "System Administrator";

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const admin = new User({
      userName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      phoneNumber: "+1234567890",
      dateOfBirth: new Date("1990-01-01"),
      gender: "Other",
      address: {
        street: "123 Hospital St",
        city: "Medical City",
        state: "MC",
        zipCode: "12345"
      },
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Emergency",
        phoneNumber: "+1234567890"
      },
      medicalHistory: []
    });

    // Save admin to database
    await admin.save();
    console.log("✅ Admin account created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("👤 Role: admin");
    console.log("\n🚀 You can now login with these credentials at the admin dashboard.");

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    
    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Make sure MongoDB is running on your system");
      console.log("2. Check if MongoDB is installed and started");
      console.log("3. Try: mongod --dbpath /path/to/your/db");
      console.log("4. Or install MongoDB as a service");
      console.log("\n📖 For Windows:");
      console.log("   - Download MongoDB Community Server");
      console.log("   - Install and start MongoDB service");
      console.log("   - Or run: net start MongoDB");
      console.log("\n📖 For macOS:");
      console.log("   - brew install mongodb-community");
      console.log("   - brew services start mongodb-community");
      console.log("\n📖 For Linux:");
      console.log("   - sudo systemctl start mongod");
      console.log("   - sudo systemctl enable mongod");
    }
  } finally {
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("Database connection closed.");
    }
  }
};

// Run the seeding function
seedAdmin();
