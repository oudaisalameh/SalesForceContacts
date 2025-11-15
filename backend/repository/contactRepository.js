// repository/contactRepository.js
const Contact = require('../models/contact');

exports.getAll = async () => {
    return await Contact.find();
};

exports.getById = async (id) => {
    return await Contact.findById(id);
};

exports.create = async (data) => {
    const contact = new Contact(data);
    return await contact.save();
};

exports.update = async (id, data) => {
    return await Contact.findByIdAndUpdate(id, data, { new: true });
};

exports.delete = async (id) => {
    return await Contact.findByIdAndDelete(id);
};