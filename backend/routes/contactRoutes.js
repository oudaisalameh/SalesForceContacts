const express = require('express');
const controller = require('../controllers/contactController');

const router = express.Router();

router.get('/contacts/', controller.getAll);
router.get('/contacts/:id', controller.getById);
router.post('/contacts/', controller.create);
router.put('/contacts/:id', controller.update);
router.delete('/contacts/:id', controller.delete);

module.exports = router;