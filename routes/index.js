var express = require('express'),
	router = express.Router();

// Get products data
var fs = require('fs'),
	rawdata = fs.readFileSync('products.json'),
	products = JSON.parse(rawdata);

// Middleware
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

var findProductsById = function(param, callback) {
	var id = param.replace('id=', '');
	var cookies = id.split(',');
	var wishlist = [];
	for(var i = 0; i < cookies.length; i++) {
		products.filter(function( obj ) {
			if(obj.id === cookies[i]) {
				wishlist.push(obj);
			}
		});
	}
	return callback(null, wishlist);
};

var findProductsByIdMiddleware = function(req, res, next) {
	if(req.params) {
		findProductsById(req.params.id, function(error, wishlist) {
			if(error) {
				res.statusCode = 400;
				return next();
			}
			res.statusCode = 200;
			res.body = wishlist;
			return next();
		})
	} else {
		return next();
	}
};

router.get('/add-to-wishlist', function(req, res) {
	// Got cookie! "req.body"
	// Do something with cookie
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

router.get('/product/:urlParam', findProductMiddleware, function(req, res) {
	res.render('product', {
		style: 'product.min.css',
		metaTitle: 'Product | Ties.com - Wishlist App',
		metaDescription: 'This is the Product page',
		product: res.body
	});
});

router.get('/api/wishlist/:id',findProductsByIdMiddleware, function(req, res) {
	res.send(res.body);
});

router.get('/wishlist/:id',findProductsByIdMiddleware, function(req, res) {
	res.render('wishlist', {
		style: 'wishlist.min.css',
		metaTitle: 'Wishlist | Ties.com - Wishlist App',
		metaDescription: 'This is the Wishlist page',
		wishlist: res.body
	});
});

router.get('/shopping-cart', function(req, res) {
	res.render('shopping-cart', {
		style: 'shopping-cart.min.css',
		metaTitle: 'Shopping Cart | Ties.com - Wishlist App',
		metaDescription: 'This is the Shopping Cart page',
		partials: {}
	});
});



module.exports= router;