$(document).ready(function() {
	'use strict';

	var storedCookies;
	var wishlistBtn = $('#add-to-wishlist');
	var wishlistBtnText = $('#add-to-wishlist .text');
	var wishlistNav = $('.nav-wishlist');
	var wishlistCount = $('.wishlist-count');
	var wishllistMsg = $('.add-to-wishlist-message');

	(function() {
		updateWishlistCount();
	})();

	$('#page-cart').ready(function() {
		if(!document.cookie || storedCookies.length === 0) {
			$('#page-cart .wishlist-widget').css('display', 'none');
		} else {
			getWishlistWisget();
		}
	});
 
	$('#page-product').ready(function() {
		var id = wishlistBtn.attr('data-id');
		initialCheckDuplicate(id);
	});

	$('#page-wishlist').ready(function() {
		if(!document.cookie || storedCookies.length === 0) {
			$('#page-wishlist .product-list').css('display', 'none');
			$('#page-wishlist .no-wishlist').css('display', 'block');
		}
	});

	wishlistBtn.click(function(event) {
		var id = event.currentTarget.dataset.id;
		var cookieString = getUpdatedCookie(id);
		var cookie = "id=" + cookieString + "; path=/";

		$.ajax({
			url: "/add-to-wishlist",
			data: {cookie: cookie},
			success: function() {
				setCookie(id);
			},
			error: function (error) {
				console.log(error);
			}
		});
	});

	$('.view-wishlist').click(function() {
		if(!document.cookie || storedCookies.length === 0) {
			console.log('no cookie');
		} else {
			getWishlist();
		}
	});

	$('.remove-wishlist').click(function(event) {
		var id = event.currentTarget.dataset.id;
		removeCookie(id);
		var removedCookie = JSON.stringify(storedCookies);
		setDocCookie(removedCookie);
		getWishlist();
	});

	$('.move-to-cart').click(function(event) {
		event.preventDefault();
		var id = event.currentTarget.dataset.id;
		removeCookie(id);
		var removedCookie = JSON.stringify(storedCookies);
		setDocCookie(removedCookie);
		updateWishlistCount();
		movetoCartUpdate(id);
	});

	function movetoCartUpdate(id) {
		var placeholder =
			'<div class="move-to-cart-placeholder">' +
				'<div class="text">We Moved This<br>Item to Your Cart</div>' +
				'<img src="/images/icons/cart_icon_2018_01.png">' +
				'<a href="/shopping-cart">' +
					'View Cart <i class="fa fa-caret-right"></i>' +
				'</a>' +
      '</div>';
		$('.product[data-id=' + id+ ']').html(placeholder);
	}

	function getIdArray() {
	  var cookie = getCookie();
		var productIds = [];
		for(var i = 0; i < cookie.length; i++) {
			productIds.push(cookie[i].id);
		}
		var idArray = productIds.join(',');
		return idArray;
	}

	function getWishlist() {
	  var ids = getIdArray();
		var url = '/wishlist/id=' + ids;
		$.get({
			url: url,
			success: function() {
				window.location.href = url;
			}
		});
	}

	function getWishlistWisget() {
	  var ids = getIdArray();
		var url = '/api//wishlist/id=' + ids;
		$.get({
			url: url,
			success: function(res) {
				console.log(res);
			}
		});
	}

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
		} else if(id) {
			return assignObject([{id: id}]);
		}
		return false;
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

	function removeCookie(id) {
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
				removeCookie(id);
				var removedCookie = JSON.stringify(storedCookies);
				setDocCookie(removedCookie);
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
				removeCookie(id);
				var removedCookie = JSON.stringify(storedCookies);
				removeCookieUpdate(id);
				return removedCookie;
			} else {
				storedCookies.push({id: id});
				var addCookie = JSON.stringify(storedCookies);
				addCookieUpdate(id);
				return addCookie;
			}
		}
	}
});