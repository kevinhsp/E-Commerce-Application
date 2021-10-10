const express = require('express');
const cartsRepo = require('../repositories/carts')
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show')
const router = express.Router();

//Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
    //Figure out the cart;
    let cart;
    if(!req.session.cartId) {
        // We don't have a cart, then create one,
        //and store the cart id on the req.seesion.cardId
        cart = await cartsRepo.create({items: [] });
        req.session.cartId = cart.id;
        
    }
    else {

        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if(existingItem) {
        //increase quantity
        existingItem.quantity++;
    }
    else {
        //add new product
        cart.items.push({id : req.body.productId, quantity: 1})
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    })
    //Either increment quantity for existing cart
    //Or add new product to items array
    res.redirect('/cart');
})
//Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
    if(!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);

    for(let item of cart.items) {
        // item === {id:, quantity}
        const product = await productsRepo.getOne(item.id);
        
        item.product = product;
    }
    res.send(cartShowTemplate({items: cart.items}));
})
//Receive a post request to delete item
router.post('/cart/products/delete', async(req, res) => {
    const cart = await cartsRepo.getOne(req.session.cartId);
    const {itemId} = req.body;
    const items = cart.items.filter(item => item.id !== itemId);
    await cartsRepo.update(req.session.cartId, {items});
    res.redirect('/cart');
})
module.exports = router;