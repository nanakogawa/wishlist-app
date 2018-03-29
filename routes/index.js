var express = require('express'),
	router = express.Router();

// Get products data
var fs = require('fs'),
	rawdata = fs.readFileSync('products.json'),
	products = JSON.parse(rawdata);

// Middleware

var getAll = function(callback) {
	if(!products) {
	  return callback(new Error('Error'));
	}
	return callback(null, products);
};

var getAllMiddleware = function(req, res, next) {
	getAll(function(error, products) {
		if(error) {
			res.statusCode = 500;
			return next(error);
		}
		res.statusCode = 200;
		res.body = products;
		return next();
	})
};

var findProduct = function(param, callback) {
	var key = Object.keys(param)[0];
	var product;
	for (var i = 0; i < products.length; i++) {
		if(products[i][key] === param[key]) {
			product = products[i];
			return callback(null, product);
		}
	}
	return callback(new Error('Product not found'));
};

var findProductMiddleware = function(req, res, next) {
	if(req.params) {
		findProduct(req.params, function(error, product) {
			if(error) {
				res.statusCode = 400;
				return next('Status Code: ' + res.statusCode + ' ' + error);
			}
			res.statusCode = 200;
			res.body = product;
			return next();
		})
	} else {
		return next();
	}
};

// APIs
router.get('/product/getAll', getAllMiddleware, function(req, res) {
	res.status(200).send(res.body);
});

router.get('/product/single/:id', findProductMiddleware, function(req, res) {
	res.status(200).send(res.body);
});

router.post('/add-to-wishlist', function(req, res) {
	// Got cookie! "req.body"
	// Do something with cookie
	console.log(req.body);
	res.status(200).send('Success!');
});

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
		product: res.body
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