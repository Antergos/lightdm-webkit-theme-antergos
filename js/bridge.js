/*
 * Copyright © 2015 Antergos
 *
 * bridge.js
 *
 * This file is part of lightdm-webkit-theme-antergos
 *
 * lightdm-webkit-theme-antergos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License,
 * or any later version.
 *
 * lightdm-webkit-theme-antergos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * The following additional terms are in effect as per Section 7 of this license:
 *
 * The preservation of all legal notices and author attributions in
 * the material or in the Appropriate Legal Notices displayed
 * by works containing it is required.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

jQuery(window).load(function () {
	var intro = $('.ant-intro-block'),
		users_container = $('.ant-users-wrapper'),
		users_slider = users_container.children('.ant-slider'),
		single_user_content = $('.ant-user-login'),
		slider_nav = $('.ant-slider-navigation'),
		resizing = false;

	window.greeter.init();

	//if on desktop - set a width for the users_slider element
	set_slider_container();
	$(window).on('resize', function () {
		//on resize - update users_slider width and translate value
		if (!resizing) {
			(!window.requestAnimationFrame) ? set_slider_container() : window.requestAnimationFrame(set_slider_container);
			resizing = true;
		}
	});

	//show the users slider if user clicks the show-users button
	intro.on('click', 'a[data-action="show-users"], a[data-action="show-users"] i', function (event) {
		event.preventDefault();
		$('.ant-intro-block.users-visible').fadeTo(350, 0.5, function () {
			var $el = $('.ant-intro-block.users-visible'),
				bg = $el.css('background');
			$el.attr('data-bg', bg);
			$el.css({'background': '#32409F'});
		}).fadeTo(350, 1);
		intro.addClass('users-visible');
		users_container.addClass('users-visible');
		//animate single user - entrance animation
		setTimeout(function () {
			show_user_preview(users_slider.children('li').eq(0));
		}, 200);
	});

	intro.on('click', function (event) {
		//users slider is visible - hide slider and show the intro panel
		if (intro.hasClass('users-visible') && !$(event.target).is('a[data-action="show-users"], a[data-action="show-users"] i')) {
			$('.ant-intro-block').fadeTo(400, 0.5, function () {
				var $el = $('.ant-intro-block'),
					bg = $el.attr('data-bg');
				$el.css({'background': bg});
			}).fadeTo(400, 1);
			intro.removeClass('users-visible');
			users_container.removeClass('users-visible');
		}
	})
	;

//select a single user - open user-login panel
	users_container.on('click', '.ant-slider a', function (event) {
		var mq = checkMQ();
		event.preventDefault();
		if ($(this).parent('li').next('li').is('.current') && (mq == 'desktop')) {
			prevSides(users_slider);
		} else if ($(this).parent('li').prev('li').prev('li').prev('li').is('.current') && (mq == 'desktop')) {
			nextSides(users_slider);
		} else {
			single_user_content.addClass('is-visible');
		}
	});

//close single user content
	single_user_content.on('click', '.close', function (event) {
		event.preventDefault();
		single_user_content.removeClass('is-visible');
	});

//go to next/pre user - clicking on the next/prev arrow
	slider_nav.on('click', '.next', function () {
		nextSides(users_slider);
	});
	slider_nav.on('click', '.prev', function () {
		prevSides(users_slider);
	});

//go to next/pre user - keyboard navigation
	$(document).keyup(function (event) {
		var mq = checkMQ();
		if (event.which == '37' && intro.hasClass('users-visible') && !(slider_nav.find('.prev').hasClass('inactive')) && (mq == 'desktop')) {
			prevSides(users_slider);
		} else if (event.which == '39' && intro.hasClass('userss-visible') && !(slider_nav.find('.next').hasClass('inactive')) && (mq == 'desktop')) {
			nextSides(users_slider);
		} else if (event.which == '27' && single_user_content.hasClass('is-visible')) {
			single_user_content.removeClass('is-visible');
		}
	});

	users_slider.on('swipeleft', function () {
		var mq = checkMQ();
		if (!(slider_nav.find('.next').hasClass('inactive')) && (mq == 'desktop')) nextSides(users_slider);
	});

	users_slider.on('swiperight', function () {
		var mq = checkMQ();
		if (!(slider_nav.find('.prev').hasClass('inactive')) && (mq == 'desktop')) prevSides(users_slider);
	});

	function show_user_preview(user) {
		if (user.length > 0) {
			setTimeout(function () {
				user.addClass('slides-in');
				show_user_preview(user.next());
			}, 50);
		}
	}

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.ant-users-wrapper'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}

	function set_slider_container() {
		var mq = checkMQ();
		if (mq == 'desktop') {
			var slides = users_slider.children('li'),
				slideWidth = slides.eq(0).width(),
				marginLeft = Number(users_slider.children('li').eq(1).css('margin-left').replace('px', '')),
				sliderWidth = ( slideWidth + marginLeft ) * ( slides.length + 1 ) + 'px',
				slideCurrentIndex = users_slider.children('li.current').index();
			users_slider.css('width', sliderWidth);
			( slideCurrentIndex != 0 ) && set_translate_value(users_slider, (  slideCurrentIndex * (slideWidth + marginLeft) + 'px'));
		} else {
			users_slider.css('width', '');
			set_translate_value(users_slider, 0);
		}
		resizing = false;
	}

	function nextSides(slider) {
		var actual = slider.children('.current'),
			index = actual.index(),
			following = actual.nextAll('li').length,
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		index = (following > 4 ) ? index + 3 : index + following - 2;
		//calculate the translate value of the slider container
		var translate = index * (width + marginLeft) + 'px';

		slider.addClass('next');
		set_translate_value(slider, translate);
		slider.one('webkitTransitionEnd transitionend', function () {
			update_slider('next', actual, slider, following);
		});

		if ($('.no-csstransitions').length > 0) update_slider('next', actual, slider, following);
	}

	function prevSides(slider) {
		var actual = slider.children('.previous'),
			index = actual.index(),
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		translate = index * (width + marginLeft) + 'px';

		slider.addClass('prev');
		set_translate_value(slider, translate);
		slider.one('webkitTransitionEnd transitionend', function () {
			update_slider('prev', actual, slider);
		});

		if ($('.no-csstransitions').length > 0) update_slider('prev', actual, slider);
	}

	function update_slider(direction, actual, slider, numerFollowing) {
		if (direction == 'next') {

			slider.removeClass('next').find('.previous').removeClass('previous');
			actual.removeClass('current');
			if (numerFollowing > 4) {
				actual.addClass('previous').next('li').next('li').next('li').addClass('current');
			} else if (numerFollowing == 4) {
				actual.next('li').next('li').addClass('current').prev('li').prev('li').addClass('previous');
			} else {
				actual.next('li').addClass('current').end().addClass('previous');
			}
		} else {

			slider.removeClass('prev').find('.current').removeClass('current');
			actual.removeClass('previous').addClass('current');
			if (actual.prevAll('li').length > 2) {
				actual.prev('li').prev('li').prev('li').addClass('previous');
			} else {
				( !slider.children('li').eq(0).hasClass('current') ) && slider.children('li').eq(0).addClass('previous');
			}
		}

		update_navigation();
	}

	function update_navigation() {
		//update visibility of next/prev buttons according to the visible slides
		var current = users_container.find('li.current');
		(current.is(':first-child')) ? slider_nav.find('.prev').addClass('inactive') : slider_nav.find('.prev').removeClass('inactive');
		(current.nextAll('li').length < 3 ) ? slider_nav.find('.next').addClass('inactive') : slider_nav.find('.next').removeClass('inactive');
	}

	function set_translate_value(item, translate) {
		item.css({
			'-webkit-transform': 'translateX(-' + translate + ')',
			'transform': 'translateX(-' + translate + ')'
		});
	}
})
;