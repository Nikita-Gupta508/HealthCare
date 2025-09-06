# Hospital Management System - Admin Account Setup

## Quick Setup Guide

### Prerequisites
- Node.js installed
- MongoDB running locally or accessible
- Backend dependencies installed

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up Environment Variables
1. Copy the environment file:
   ```bash
   cp config.env .env
   ```

2. Edit `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/hospital
   jwtsecret=your-super-secret-jwt-key-change-this-in-production
   PORT=4451
   NODE_ENV=development
   ```

### Step 3: Create Admin Account
Run the admin seeding script:
```bash
npm run seed-admin
```

Or directly:
```bash
node seedAdmin.js
```

### Step 4: Start the Application
```bash
# Start backend
npm start

# In another terminal, start frontend
cd ../frontend
npm install
npm run dev
```

## Admin Login Credentials

After running the seeding script, you can login with:

- **Email**: admin@hospital.com
- **Password**: admin123
- **Role**: admin

## Admin Features

Once logged in as admin, you can:
- Manage patients
- Manage doctors
- Manage nurses
- Manage departments
- View contact queries
- Manage newsletters
- View system statistics

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change the default password** after first login
2. **Update the JWT secret** in production
3. **Use a strong MongoDB connection string** in production
4. **Consider using environment-specific configurations**

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Admin Already Exists**
   - The script will skip creation if admin exists
   - Check existing admin in database

3. **Permission Denied**
   - Ensure you have write permissions to the database
   - Check MongoDB user permissions

### Manual Admin Creation (Alternative)

If the script doesn't work, you can create an admin manually in MongoDB:

```javascript
// In MongoDB shell
use hospital
db.users.insertOne({
  userName: "System Administrator",
  email: "admin@hospital.com",
  password: "$2b$10$hashedPasswordHere", // Use bcrypt to hash "admin123"
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
})
```

## Support

If you encounter any issues, check:
1. MongoDB connection
2. Environment variables
3. Node.js version compatibility
4. Database permissions
