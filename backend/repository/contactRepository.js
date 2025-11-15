const Contact = require('../models/contact');

exports.getAll = async () => await Contact.find();

exports.getById = async (id) => await Contact.findOne({ id });

exports.create = async (data) => {
    try {
        const contact = new Contact(data);
        if (!contact.id) contact.id = require('uuid').v4();
        return await contact.save();
    } catch (error) {
        console.log(error)
    }

};

exports.update = async (id, data) => await Contact.findOneAndUpdate({ id }, data, { new: true });

exports.delete = async (id) => await Contact.findOneAndDelete({ id });