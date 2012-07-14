/*
 * jQuery Github Widget
 * Author: Joe Pettersson, @Joe8Bit
 * http://www.joepettersson.com/jquery-github-widget/
 * https://github.com/JoePettersson/jquery-github-widget/
 * Licensed under the MIT license
 * Version: 1.0
 *
 * Options:
 * 		user: [String] the username of the user for whom we're building the widget
 * 		show_extended_info: [Boolean] when someone hovers over the avatar, more detailed user info is shown
 * 		show_follows: [Boolean] show the number of followers a user has in the widget header
 * 		width: [String] a CSS compliant value representing a width (px/%/em/pt)
 * 		show_repos: [Number] The number of repos that should be displayed
 * 		oldest_first: [Boolean] The default is to show the most recent repo first, set this to true to show the oldest first
 *
 */
;(function ($, window, document, undefined) {
	"use strict";
	// Setup our defaults
	var pluginName = 'github',
		defaults = {
			user: "joepettersson",
			show_extended_info: true,
			show_follows: true,
			width: "400px",
			show_repos: 10,
			oldest_first: false
		};

	// The plugin constructor
	function Github(element, options) {
		// Set the element specified by the user
		this.element = element;
		// Combie in the defaults and options into a single options object
		this.options = $.extend({}, defaults, options);
		// Instantiate our init function, it inherits the options object, so we don't need to explicitly pass it
		this.init();
	}

	// Our Prototype!
	Github.prototype = {
		// Our controller
		init: function () {
			// Explicitly set our options and element so they can be inherited by functions
			// Then init our functions to build the widget
			var el = this.element,
				options = this.options,
				user = this.model("user", options.user, function(data){
					// Build layout view with user data and append it to the specified element
					$(el).append(Github.prototype.view_layout(data.data, options));
				}),
				repos = this.model("repos", options.user, function(data){
					// Build our repos partial and append it to the layout, which is already in the DOM
					$(el).find("#repos ul").append(Github.prototype.view_partial_repos(data, options, el));
					// Fade out the Github loader gif, and then fade in the repos we just appended
					$(el).find("#repos #github-loader").slideUp(250, function(){
						$(el).find("#repos ul").slideDown(250);
					});
					// Init our bind function once everything is present within the DOM
					Github.prototype.bind(options);
				});
		},

		// Our user model, get and set user data
		model: function (type, user, callback) {
			// Construct our endpoint URL depending on what is being requested
			var url = "https://api.github.com/users/" + user.toLowerCase(); if (type === "repos") { url += "/repos"; } url += "?callback=?";
			// Get data from Github user endpoint, JSONP bitches
			$.getJSON(url, function(data){
				// Make sure our callback is defined and is of the right type, if it is fire it
				if(typeof callback !== "undefined" && typeof callback === "function") {
					callback(data);
				}
			});
		},

		// The main layout for the widget
		view_layout: function (user, options) {
			var markup = '';
				// As it's setting a simple string, the width value can be anything acceptable to CSS (px/%/em/pt etc)
				markup += '<div id="github" style="width: ' + options.width + '">';
				markup += '<div id="header" class="clear">';
				markup += '<div id="logo"><a href="https://github.com/">Github</a></div>';
				markup += '<div id="user"><a href="' + user.html_url + '" id="github-user">';
				// If the user has a custom avatar then show it, if not display the default github avatar (served from their CDN)
				if (typeof user.avatar_url !== "undefined" && user.avatar_url.length > 0){
					markup += '<img src="' + user.avatar_url + '" alt="Avatar" width="34px" height="34px" />';
				} else {
					markup += '<img src="https://a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-140.png" alt="Avatar" width="34px" height="34px" />';
				}
				markup += '</a></div>';
				// Check if we should show the extended info, a custom option
				// Within extended info we need to check for the existence of elements, as not everyone has the same info set in their Github profile
				if (options.show_extended_info === true){
					markup += '<div id="extended-user-info">';
					if (typeof user.name !== "undefined" && user.name.length > 0){
						markup += '<p class="name">' + user.name + '</p>';
					}
					markup += '<p class="place">';
					if (typeof user.company !== "undefined" && user.company.length > 0){
						markup += user.company + ' ' ;
					}
					if (typeof user.location !== "undefined" && user.location.length > 0){
						markup += user.location;
					}
					markup += '</p>';
					if (typeof user.bio === "string" && user.bio.length > 0){
						markup += '<p class="bio">' + user.bio + '</p>';
					}
					if (user.hireable === true){
						markup += '<p class="hireable">I\'m availabe for hire!</p>';
					}
					markup += '<span class="repos">' + user.public_repos + ' repos</span>';
					markup += '<span class="gists">' + user.public_gists + ' gists</span>';
					markup += '</div>';
				}
				markup += '<div id="github-user-data">';
				markup += '<h2><a href="' + user.html_url + '">' + user.login + '</a></h2>'
				markup += '<a href="' + user.html_url + '" id="header-total-repos">' + user.public_repos + ' repos</a>';
				// Check if the option to show followers is set to true, if not, don't show it
				if (options.show_follows === true){
					markup += ' | <a href="https://github.com/' + user.login.toLowerCase() + '/followers" id="current-followers">' + user.followers + ' followers</a>';
				}
				markup += '</div>'
				markup += '</div>';
				// The element which the repos partial will eventually be appended to
				markup += '<div id="repos"><div id="github-loader"></div><ul></ul></div>'
				markup += '</div>';
				return markup;
		},

		// Our repos partial, which will construct the repo list itself
		view_partial_repos: function (data, options, el) {
			var markup = '';
			// Are we displaying our repos oldest first?
			if (options.oldest_first === true){
				// Yes? use the reverse method to reverse the order of the data objects
				var data = data.data.reverse()
			} else {
				var data = data.data;
			}
			// Iterate through the repos
			$.each(data, function(i){
				// Github returns pages of 30 repos per request, however we only want to show the number set in the options
				if (i <= options.show_repos - 1){
					markup += '<li id="repo-' + i +'" class="clear repo';
					// This is a little bit of a hack to make the CSS easier, if the repo has a language attribute, it will mean
					// the box carries over two lines, which means the buttons on the right become missaligned. So therefore, if
					// there are two lines, add a special class so we can style it more easily.
					if (this.language !== null){
						markup += ' double';
					}
					markup += '">';
					markup += '<div class="left">';
					markup += '<p class="title"><a href="' + this.html_url + '" data-description="<p>' + this.name +'</p>' + this.description + '" class="github-tooltip">' + this.name + '</a></p>';
					markup += '<p class="meta-data">';
					if (this.language !== null){
						markup += '<span class="language">' + this.language + '</span></p>';
					}
					markup += '</div>';
					markup += '<div class="right">';
					markup += '<span class="forks github-tooltip" data-description="This repo has ' + this.forks + ' fork(s)">' + this.forks + '</span>';
					markup += '<span class="watchers github-tooltip" data-description="This repo has ' + this.watchers + ' watcher(s)">' + this.watchers + '</span>';
					markup += '<span class="issues github-tooltip" data-description="This project has ' + this.open_issues + ' open issues">' + this.open_issues + '</span>';
					markup += '</div>';
					markup += '</li>';
				}
			});
			return markup;
		},

		// Our bin utility funciton that will be init'd once we have populated the DOM
		bind: function (options) {
			// If the option to show the extended user info is set to true then bind it to do so
			if (options.show_extended_info === true){
				$("#github-user").hover(function(){
					$("#github #header #extended-user-info").fadeIn(250, function(){
						$("#github #header img").addClass("no-bottom-border");
					});
				}, function(){
					$("#github #header #extended-user-info").fadeOut(250, function(){
						$("#github #header img").removeClass("no-bottom-border");
					});
				});
			}
			// Make the buttons become opaque when hovering over a repo row
			$("#github li").hover(function(){
				$(this).find(".right").animate({opacity: 1}, 200);
			}, function(){
				$(this).find(".right").animate({opacity: 0.3}, 200);
			});
			// Our main tooltip function
			$(".github-tooltip").hover(function(){
				var markup = '<div class="github-tooltip-content">' + $(this).attr("data-description") +'</div>';
				$(this).append(markup);
			}, function(){
				$(".github-tooltip-content").remove();
			});
		}
	};

	// Setup our plugin
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
				new Github( this, options ));
			}
		});
	}

})( jQuery, window, document );
