const Contact = require('../models/contact');

exports.getAll = async () => await Contact.find();

exports.getById = async (id) => await Contact.findOne({ id });

exports.create = async (data) => {
    const contact = new Contact(data);
    if (!contact.id) contact.id = require('uuid').v4();
    return await contact.save();
};

exports.update = async (id, data) => await Contact.findOneAndUpdate({ id }, data, { new: true });

exports.delete = async (id) => await Contact.findOneAndDelete({ id });