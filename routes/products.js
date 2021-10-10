const express = require('express');
const productsRepo = require('../repositories/products');
const router = express.Router();
const productsIndexTemplate = require('../views/products/index');
router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
})

module.exports = router;