var express = require('express'),
    router = express.Router();

// Get products data
var fs = require('fs'),
		rawdata = fs.readFileSync('products.json'),
    products = JSON.parse(rawdata);

// Set routes
router.get('/', function(req, res) {
	res.render('index', {
		style: 'home.min.css',
		metaTitle: 'Ties.com | Wishlist App',
		metaDescription: 'This is the Home page',
		products: products
	})
});

router.get('/product/id', function(req, res) {
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

router.get('/add-to-wishlist', function(req, res) {

	// Do something

	res.status(200).json({
		"success" : true,
		"errors" : "Error message: Uh oh!"
	});
});

module.exports= router;