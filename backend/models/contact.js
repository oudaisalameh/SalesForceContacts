// models/contactModel.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const contactSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, minlength: 2 },
    address: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true },
    cell: { type: String },
    registered: { type: Date, required: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    picture: { type: String, required: true, match: /^https?:\/\// },
});


contactSchema.virtual('id').get(function () {
    return this._id;
});

contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema);