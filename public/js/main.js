$(document).ready(function() {
	'use strict';

	var storedCookies;
	var userIsSignedIn = true;
	var wishlistBtn = $('#add-to-wishlist');
	var wishlistBtnText = $('#add-to-wishlist .text');
	var wishlistNav = $('.nav-wishlist');
	var wishlistCount = $('.wishlist-count');

	(function() {
		updateWishlistCount();
	})();

	$('#page-product').ready(function() {
		var id = wishlistBtn.attr('data-id');
		initialCheckDuplicate(id);
	});

	function assignObject(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (source.hasOwnProperty(key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	}

	function initialCheckDuplicate(id) {
		if(checkDuplicate(id)) {
			wishlistBtnText.text('Added to Wishlist');
		}
	}

	function updateWishlistCount(id) {
		if(!document.cookie || !storedCookies || storedCookies.length === 0) {
			wishlistNav.css('display', 'none')
		} else {
			wishlistCount.text(getCookie(id).length);
		}
	}

	function getCookie(id) {
		if(document.cookie) {
			var idCookies = document.cookie.split('; ').reduce(function(obj, string) {
				var split = string.split('=');
				return assignObject({[split[0]]: [split[1]]})
			}, {});
			return storedCookies = JSON.parse(idCookies['id']);
		}
		return assignObject([{id: id}]);
	}

	function checkDuplicate(id) {
		if(document.cookie) {
			getCookie();
			for(var i = 0; i < storedCookies.length; i++) {
				if(storedCookies[i].id === id) {
					return true;
				}
			}
		}
		return false;
	}

	function removeCookieUpdate(id) {
		wishlistBtnText.text('Add to Wishlist');
		updateWishlistCount(id);
		if(storedCookies.length === 0) {
			wishlistNav.css('display', 'none')
		}
	}

	function addCookieUpdate(id) {
		wishlistBtnText.text('Added to Wishlist');
		updateWishlistCount(id);
		if(storedCookies.length !== 0) {
			wishlistNav.css('display', 'inline');
		}
	}

	function removeDuplicate(id) {
		for(var i = 0; i < storedCookies.length; i++) {
			if(storedCookies[i].id === id) {
				storedCookies.splice(i, 1);
			}
		}
	}

	function setDocCookie(cookie) {
		document.cookie = "id=" + cookie + "; path=/";
	}

	// Add product to wishlist
	function setCookie(id) {
		var duplicate = false;

		if(!document.cookie) {
			var newCookie = [];
			newCookie.push({id: id});
			setDocCookie(JSON.stringify(newCookie))
		} else {
			duplicate = checkDuplicate(id);
			if(duplicate) {
				removeDuplicate(id);
				setDocCookie(JSON.stringify(storedCookies));
				removeCookieUpdate(id);
			} else {
				storedCookies.push({id: id});
				setDocCookie(JSON.stringify(storedCookies));
				addCookieUpdate(id);
			}
		}
	}

	function checkCookie(id) {
		var duplicate = false;

		if(!document.cookie) {
			var newCookie = [];
			newCookie.push({id: id});
			wishlistBtnText.text('Added to Wishlist');
			wishlistCount.text('1');
			wishlistNav.css('display', 'inline');
			return JSON.stringify(newCookie);
		} else {
			duplicate = checkDuplicate(id);
			if(duplicate) {
				removeDuplicate(id);
				removeCookieUpdate(id);
				return JSON.stringify(storedCookies);

			} else {
				storedCookies.push({id: id});
				addCookieUpdate(id);
				return JSON.stringify(storedCookies);
			}
		}
	}

	$('#wishlist-form').submit(function(event) {
		event.preventDefault();

		var inputs = $('#wishlist-form input');
		var values = {};
    inputs.each(function() {
        values[this.name] = $(this).val();
    });

    var id = values.id;
		var stringCookie = checkCookie(id);
		var cookie = "id=" + stringCookie + "; path=/";

		if(!userIsSignedIn) {
			setCookie(id);
		} else {
			$.ajax({
				type: 'POST',
				url: "/add-to-wishlist",
				data: {cookie: cookie},
				success: function(res, status, xhr) {
					setCookie(id);
				},
				error: function (error) {
					console.log('Status Code ' + error.status + ': ' + error.statusText);
				}
			});
		}
	});

	// Get all products
	// $("#page-home").ready( function() {
	// 	var products;
	//
	// 	$.ajax({
	// 		url: "/product/getAll",
	// 		success: function(res){
	// 			products = res;
	// 		},
	// 		error: function (error) {
	// 			console.log('Status Code ' + error.status + ': ' + error.statusText);
	// 		}
	// 	});
	// });
});