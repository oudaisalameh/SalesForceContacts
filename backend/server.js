const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://thedevilstraining:9oX9VIfbwexBWT1y@database.rriwm.mongodb.net/SalesForce2?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Atlas Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/contacts', contactRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));