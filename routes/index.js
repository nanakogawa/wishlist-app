var express = require('express'),
	router = express.Router();

// Get products data
var fs = require('fs'),
	rawdata = fs.readFileSync('products.json'),
	products = JSON.parse(rawdata);

var findProduct = function(urlParam, callback) {
	var success = false,
			product;

	for (var i = 0; i < products.length; i++) {
			if(products[i].urlParam === urlParam) {
			  success = true;
				product = products[i];
				return callback(null, product);
			}
	}

	if(!success) {
		return callback(new Error('Product not found'));
	}
};

var findProductMiddleware = function(req, res, next) {
	if(req.params.urlParam) {
			console.log('Product name param was detected: ' + req.params.urlParam);
			findProduct(req.params.urlParam, function(error, product) {
				if(error) {
				  res.statusCode = 500;
					return next(error);
				}
				res.statusCode = 200;
				req.product = product;
				return next();
			})
	} else {
		return next();
	}
};

// Set routes
router.get('/', function(req, res) {
	res.render('index', {
		style: 'home.min.css',
		metaTitle: 'Ties.com | Wishlist App',
		metaDescription: 'This is the Home page',
		products: products
	})
});

router.get('/product/:urlParam',findProductMiddleware, function(req, res) {
	res.render('product', {
		style: 'product.min.css',
		metaTitle: 'Product | Ties.com - Wishlist App',
		metaDescription: 'This is the Product page',
		product: req.product
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