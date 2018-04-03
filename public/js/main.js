$(document).ready(function() {
	'use strict';

	var storedCookies = getCookie() ? getCookie() : [];
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
			$('#page-cart .wishlist-widget .product').css('display', 'none');
			$('#page-cart .wishlist-widget .error-message').css('display', 'block');
		} else {
			getWishlistWidgetData();
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
				// Error handling
			}
		});
	});

	$('.view-wishlist').click(function() {
		if(storedCookies.length === 0) {
			// Error handling
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
		var productIds = [];
		for(var i = 0; i < storedCookies.length; i++) {
			productIds.push(storedCookies[i].id);
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

	function getWishlistWidgetData() {
		var ids = getIdArray();
		var url = '/api/wishlist/id=' + ids;
		$.get({
			url: url,
			success: function(res) {
				var container = $('.wishlist-widget .widget-products .product-list');
				for(var i = 0; i < res.length; i++) {
					container.append(
						'<div class="product">' +
						  '<div class="product-image-container">' +
						    '<a href="' + res[i].url + '">' +
								'<img class="product-img" ' +
											'src="/images/products/' + res[i].image + '" ' +
						          'alt="' + res[i].name + '" ' +
						          'title="' + res[i].name +
						    '">' +
						    '</a>' +
						    '<a href="#" ' +
						        'class="move-to-cart-overlap" ' +
										'data-id="' + res[i].id +'">' +
									'Move to Cart' +
					      '</a>' +
					    '</div>' +
					    '<a href="' + res[i].url + '">' +
								'<div class="product-info">' +
									'<div>' + res[i].name + '</div>' +
									'<div>' + res[i].price + '</div>' +
								'</div>' +
							'</a>' +
						'</div>'
					)
				}
				$('.wishlist-widget .widget-products').html(container);
			}
		});
	}

	$('#page-cart').on('click', 'a.move-to-cart-overlap', function(event) {
		var id = event.currentTarget.dataset.id;
		removeCookie(id);
		var removedCookie = JSON.stringify(storedCookies);
		setDocCookie(removedCookie);
		location.reload();
	});

	function initialCheckDuplicate(id) {
		if(checkDuplicate(id)) {
			wishlistBtn.css('color', '#d61d33');
			wishlistBtnText.text('Added to Wishlist');
		}
	}

	function updateWishlistCount(id) {
		if(getCookie()) {
			wishlistCount.text(storedCookies.length);
		} else {
			wishlistNav.css('display', 'none')
		}
	}

	function getCookie(id) {
		if(document.cookie) {
			var cookiename = "wishlist";
		  var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
		  var idCookies = decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : '[]');
			return storedCookies = JSON.parse(idCookies);
		} else if(id) {
			return [{id: id}];
		}
		return false;
	}

	function checkDuplicate(id) {
		if(getCookie()) {
			for(var i = 0; i < storedCookies.length; i++) {
				if(storedCookies[i].id === id) {
					return true;
				}
			}
		}
		return false;
	}

	function removeCookieUpdate(id) {
		wishlistBtn.css('color', '#212121');
		wishlistBtnText.text('Add to Wishlist');
		updateWishlistCount(id);
		if(storedCookies.length === 0) {
			wishlistNav.css('display', 'none')
		}
	}

	function addCookieUpdate(id) {
		wishlistBtn.css('color', '#d61d33');
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
		document.cookie = "wishlist=" + cookie + "; path=/";
	}

	function setCookie(id) {
		if(checkDuplicate(id)) {
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

	function getUpdatedCookie(id) {
		if(!document.cookie) {
			var newCookie = [];
			newCookie.push({id: id});
			var firstCookie = JSON.stringify(newCookie);
			addCookieUpdate(id);
			return firstCookie;
		} else {
			if(checkDuplicate(id)) {
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