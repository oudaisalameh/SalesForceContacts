// models/contactModel.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    address: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true },
    cell: { type: String },
    registered: { type: Date, required: true },
    age: { type: Number, required: false, min: 0, max: 150 },
    picture: { type: String, required: false, match: /^https?:\/\// },
});


module.exports = mongoose.model('Contact', contactSchema);