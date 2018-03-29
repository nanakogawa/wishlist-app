$(document).ready(function() {
	'use strict';

	var storedCookies;
	var userIsSignedIn = true; // Award winning user auth
	var wishlistBtn = $('#add-to-wishlist');
	var wishlistBtnText = $('#add-to-wishlist .text');
	var wishlistNav = $('.nav-wishlist');
	var wishlistCount = $('.wishlist-count');
	var wishllistMsg = $('.add-to-wishlist-message');

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
		if(!document.cookie) {
			wishlistNav.css('display', 'none')
		} else {
			if(getCookie(id).length !== 0) {
				wishlistCount.text(getCookie(id).length);
			} else {
				wishlistNav.css('display', 'none')
			}
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
			getCookie(id);
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
				break;
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
			var firstCookie = JSON.stringify(newCookie);
			setDocCookie(firstCookie);
			wishllistMsg.slideDown(300, 'swing');
		} else {
			duplicate = checkDuplicate(id);
			if(duplicate) {
				removeDuplicate(id);
				var removeCookie = JSON.stringify(storedCookies);
				setDocCookie(removeCookie);
				removeCookieUpdate(id);
				wishllistMsg.slideUp(300, 'swing');
			} else {
				storedCookies.push({id: id});
				var addCookie = JSON.stringify(storedCookies);
				setDocCookie(addCookie);
				addCookieUpdate(id);
				wishllistMsg.slideDown(300, 'swing');
			}
		}
	}

	function getUpdatedCookie(id) {
		var duplicate = false;

		if(!document.cookie) {
			var newCookie = [];
			newCookie.push({id: id});
			var firstCookie = JSON.stringify(newCookie);
			wishlistBtnText.text('Added to Wishlist');
			wishlistCount.text('1');
			wishlistNav.css('display', 'inline');
			return firstCookie;
		} else {
			duplicate = checkDuplicate(id);
			if(duplicate) {
				removeDuplicate(id);
				var removeCookie = JSON.stringify(storedCookies);
				removeCookieUpdate(id);
				return removeCookie;

			} else {
				storedCookies.push({id: id});
				var addCookie = JSON.stringify(storedCookies);
				addCookieUpdate(id);
				return addCookie;
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
		var stringCookie = getUpdatedCookie(id);
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