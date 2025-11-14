const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const contactSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    cell: { type: String },
    registered: { type: Date },
    age: { type: Number },
    picture: { type: String }
}, { _id: false });

module.exports = mongoose.model('Contact', contactSchema);