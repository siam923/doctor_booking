const mongoose = require('mongoose');
const Specialization = require('../models/Specialization');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const initSpecializations = async () => {
  const specializations = [
    { name: 'Cardiology', description: 'Heart and cardiovascular system specialist' },
    { name: 'Neurology', description: 'Nervous system specialist' },
    { name: 'Pediatrics', description: 'Children and adolescent medicine specialist' },
    { name: 'Orthopedics', description: 'Musculoskeletal system specialist' },
    { name: 'Dermatology', description: 'Skin, hair, and nails specialist' }
  ];

  for (const spec of specializations) {
    const existingSpec = await Specialization.findOne({ name: spec.name });
    if (!existingSpec) {
      await Specialization.create(spec);
      console.log(`Specialization ${spec.name} initialized`);
    } else {
      console.log(`Specialization ${spec.name} already exists`);
    }
  }

  mongoose.connection.close();
};

initSpecializations();
