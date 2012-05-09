/**
 * global.js
 * 
 * Provides the core logic for intercepting Amazon Affiliate links
 */

// Adds listener event for the tab to intercept Amazon affiliate loading
var setupTabListeners = function(event) {
	var tab = event.target;
	// Ensure we are working with a tab, not a window (only windows have a tabs array property)
	if (typeof tab.tabs === 'undefined') {
		tab.addEventListener("beforeNavigate", interceptAffiliateLinks, false);
	}
};

// Remove listener when tab closes
var cleanupTabListeners = function(event) {
	var tab = event.target;
	// Ensure that we are working with a tab, not a window
	if (typeof tab.tabs === 'undefined') {
		tab.removeEventListener("beforeNavigate", interceptAffiliateLinks, false);
	}
};

// Checks to see if we are visiting an affiliate link; the core of our extension
var affRE = /^http:\/\/(?:|.+?\.)amazon\..+?(?:\?|&)tag=([a-z0-9_-]+).*?$/i;
var interceptAffiliateLinks = function(event) {
	var results = affRE.exec(event.url);
	if (results !== null) {
		// We have an affiliate link; kill the load!
		event.preventDefault();
	}
};

var manageSettings = function(event) {
	if (event.name === 'AMNWhitelistTag') {
		safari.extension.settings.whitelist.push(tag);
	} else if (event.name === 'AMNBlacklistTag') {
		safari.extension.settings.blacklist.push(tag);
	}
};

// Start listening to our open, close, and message events
safari.application.addEventListener("open", setupTabListeners, true);
safari.application.addEventListener("close", cleanupTabListeners, true);
safari.application.addEventListener("message", manageSettings, false);