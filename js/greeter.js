/*
 * Copyright © 2015 Antergos
 *
 * greeter.js
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

var DEBUG = true,
	selectedUser = null,
	authPending = null,
	users_shown = null,
	user_list;


/**
 * Logs.
 */
function log(text) {
	if (DEBUG) {
		$('#logArea').append(text);
		$('#logArea').append('<br/>');
	}
}

window.greeter = {

	init: function () {
		this.initialize_timer();
		this.initialize_user_list();
	},

	initialize_user_list: function () {
		var _self = this,
			$user_list = $('.ant-slider'),
				first = true;
		for (var i in lightdm.users) {
			var user = lightdm.users[i],
				last_session = localStorage.getItem(user.name + ':session'),
				$user_el = $(_self.partial.user),
				image_src = (user.image.length > 0) ? user.image : 'img/user-img2.png';

			if (last_session === null || last_session === undefined) {
				localStorage.setItem(user.name + ':session', lightdm.default_session);
			}
			if (true === first) {
				$user_el.addClass('current');
				first = false;
			}
			log('Last Session (' + user.name + '): ' + last_session);
			$user_el.attr({
				'data-username': user.name,
				'data-session': last_session
			});
			$user_el.find('h2').text(user.display_name);
			$user_el.find('img').attr('src', image_src);

			$($user_list).append($user_el);
		}
	},

	buildSessionList: function () {
		// Build Session List
		for (var i in lightdm.sessions) {
			var session = lightdm.sessions[i];
			var btnGrp = document.getElementById('sessions');
			var theClass = session.name.replace(/ /g, '');
			var button = '\n<li><a href="#" id="' + session.key + '" onclick="sessionToggle(this)" class="' + theClass + '">' + session.name + '</a></li>';

			$(btnGrp).append(button);


		}
	},

	show_users: function () {
		if ($('#collapseOne').hasClass('in')) {
			$('#trigger').trigger('click');
			users_shown = true;
		}
		if ($('#user-list2 a').length <= 1) $('#user-list2 a').trigger('click');

	},


	get_hostname: function () {
		var hostname = lightdm.hostname;
		var hostname_span = document.getElementById('hostname');
		$(hostname_span).append(hostname);
	},


	update_time: function (lang) {
		var $time = $("#current_time"),
			date = new Date(),
			twelveHr = [
				'sq-al',
				'zh-cn',
				'zh-tw',
				'en-au',
				'en-bz',
				'en-ca',
				'en-cb',
				'en-jm',
				'en-ng',
				'en-nz',
				'en-ph',
				'en-us',
				'en-tt',
				'en-zw',
				'es-us',
				'es-mx'],
			is_twelveHr = twelveHr.indexOf(lang),
			hh = date.getHours(),
			mm = date.getMinutes(),
			suffix = "AM";
		if (hh >= 12) {
			suffix = "PM";
			if (is_twelveHr !== -1 && is_twelveHr !== 12) {
				hh = hh - 12;
			}
		}
		if (mm < 10) {
			mm = "0" + mm;
		}
		if (hh === 0 && is_twelveHr !== -1) {
			hh = 12;
		}
		$time.text(hh + ":" + mm + " " + suffix);
	},

	initialize_timer: function () {
		var _self = this,
			lang = lightdm.get_default_language();
		log(lang);
		_self.update_time(lang);
		setInterval(_self.update_time.bind(lang), 60000);
	},

	checkKey: function (event) {
		var action;
		switch (event.which) {
			case 13:
				action = authPending ? submitPassword() : !users_shown ? show_users() : 0;
				log(action);
				break;
			case 27:
				action = authPending ? cancelAuthentication() : 0;
				log(action);
				break;
			case 32:
				action = !users_shown && !authPending ? show_users() : 0;
				log(action);
				break;
			default:
				break;
		}
	},

	addActionLink: function (id) {
		if (eval("lightdm.can_" + id)) {
			var label = id.substr(0, 1).toUpperCase() + id.substr(1, id.length - 1);
			var id2;
			if (id == "shutdown") {
				id2 = "power-off"
			}
			if (id == "hibernate") {
				id2 = "asterisk"
			}
			if (id == "suspend") {
				id2 = "arrow-down"
			}
			if (id == "restart") {
				id2 = "refresh"
			}
			$("#actionsArea").append('\n<button type="button" class="btn btn-default ' + id + '" data-toggle="tooltip" data-placement="top" title="' + label + '" data-container="body" onclick="handleAction(\'' + id + '\')"><i class="fa fa-' + id2 + '"></i></button>');
		}
	},

	capitalize: function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	handleAction: function (id) {
		log("handleAction(" + id + ")");
		eval("lightdm." + id + "()");
	},

	getUserObj: function (username) {
		var user = null;
		for (var i = 0; i < lightdm.users.length; ++i) {
			if (lightdm.users[i].name == username) {
				user = lightdm.users[i];
				break;
			}
		}
		return user;
	},

	getSessionObj: function (sessionname) {
		var session = null;
		for (var i = 0; i < lightdm.sessions.length; ++i) {
			if (lightdm.sessions[i].name == sessionname) {
				session = lightdm.sessions[i];
				break;
			}
		}
		return session;
	},


	startAuthentication: function (userId) {
		log("startAuthentication(" + userId + ")");

		if (selectedUser !== null) {
			lightdm.cancel_authentication();
			localStorage.setItem('selUser', null);
			log("authentication cancelled for " + selectedUser);
		}
		localStorage.setItem('selUser', userId);
		selectedUser = '.' + userId;
		$(selectedUser).addClass('hovered');
		console.log(user_list);
		if ($(user_list).children().length > 3) {
			$(user_list).css('column-count', 'initial');
			$(user_list).parent().css('max-width', '50%');
		}
		$(selectedUser).siblings().hide();
		$('.fa-toggle-down').hide();


		var usrSession = localStorage.getItem(userId);

		log("usrSession: " + usrSession);
		var usrSessionEl = "#" + usrSession;
		var usrSessionName = $(usrSessionEl).html();
		log("usrSessionName: " + usrSessionName);
		$('.selected').html(usrSessionName);
		$('.selected').attr('id', usrSession);
		$('#session-list').removeClass('hidden');
		$('#session-list').show();
		$('#passwordArea').show();
		authPending = true;

		lightdm.start_authentication(userId);
	},

	cancelAuthentication: function () {
		log("cancelAuthentication()");
		$('#statusArea').hide();
		$('#timerArea').hide();
		$('#passwordArea').hide();
		$('#session-list').hide();
		lightdm.cancel_authentication();
		log("authentication cancelled for " + selectedUser);
		if ($(user_list).children().length > 3) {
			$(user_list).css('column-count', '2');
			$(user_list).parent().css('max-width', '85%');
		}
		$('.list-group-item').removeClass('hovered').siblings().show();
		$('.fa-toggle-down').show();
		selectedUser = null;
		authPending = false;
		return true;
	},

	submitPassword: function () {
		log("provideSecret()");
		lightdm.provide_secret($('#passwordField').val());
		$('#passwordArea').hide();
		$('#timerArea').show();
		log("done");
	},

	imgNotFound: function (source) {
		source.src = 'img/antergos-logo-user.jpg';
		source.onerror = "";
		return true;
	},

	sessionToggle: function (el) {
		var selText = $(el).text();
		var theID = $(el).attr('id');
		var selUser = localStorage.getItem('selUser');
		$(el).parents('.btn-group').find('.selected').attr('id', theID);
		$(el).parents('.btn-group').find('.selected').html(selText);
		localStorage.setItem(selUser, theID)
	},

	partial: {
		user: '<li><a href="#"><img src="" alt=""><div class="ant-user-info"><h2></h2></div></a></li>'

	}
};

/**
 * Lightdm Callbacks
 */
function show_prompt(text) {
	log("show_prompt(" + text + ")");
	$('#passwordField').val("");
	$('#passwordArea').show();
	$('#passwordField').focus();
}

function authentication_complete() {
	log("authentication_complete()");
	authPending = false;
	$('#timerArea').hide();
	var selSession = $('.selected').attr('id');
	if (lightdm.is_authenticated) {
		log("authenticated !");
		lightdm.login(lightdm.authentication_user, selSession);
	} else {
		log("not authenticated !");
		$('#statusArea').show();
	}
}

function show_message(text) {
	var msgWrap = document.getElementById('statusArea'),
		showMsg = document.getElementById('showMsg');
	showMsg.innerHTML = text;
	if (text.length > 0) {
		$('#passwordArea').hide();
		$(msgWrap).show();
	}
}

function show_error(text) {
	show_message(text);
}
/*
 $(document).keydown(function (e) {
 checkKey(e);
 });
 // Action buttons
 addActionLink("shutdown");
 addActionLink("hibernate");
 addActionLink("suspend");
 addActionLink("restart");*/
