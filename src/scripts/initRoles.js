const mongoose = require('mongoose');
const Role = require('../models/Role');
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);

const initRoles = async () => {
  const roles = ['patient', 'doctor', 'admin'];

  for (const roleName of roles) {
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`Role ${roleName} initialized`);
    } else {
      console.log(`Role ${roleName} already exists`);
    }
  }

  mongoose.connection.close();
};

initRoles();
