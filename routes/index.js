var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', {
		style: 'home.min.css',
		metaTitle: 'Home | Ties.com - Wishlist App',
		metaDescription: 'This is the Home page'
	})
});

router.get('/product', function(req, res) {
	res.render('product', {
		style: 'product.min.css',
		metaTitle: 'Product | Ties.com - Wishlist App',
		metaDescription: 'This is the Product page'
	});
});

router.get('/wishlist', function(req, res) {
	res.render('wishlist', {
		style: 'wishlist.min.css',
		metaTitle: 'Wishlist | Ties.com - Wishlist App',
		metaDescription: 'This is the Wishlist page'
	});
});

router.get('/shopping-cart', function(req, res) {
	res.render('shopping-cart', {
		style: 'shopping-cart.min.css',
		metaTitle: 'Shopping Cart | Ties.com - Wishlist App',
		metaDescription: 'This is the Shopping Cart page'
	});
});

module.exports= router;