/* global $ */
var cookies_options = cookies_options || {};

/** Defines functionality for cookie options */
(function (cookies_options) {
  var COOKIES_BANNER = '#cookies-banner';
  var COOKIES_BANNER_ACCEPTED = COOKIES_BANNER + '-accepted'
  var COOKIES_BANNER_REJECTED = COOKIES_BANNER + '-rejected'
  var COOKIE_ACCEPT_BUTTON = '#cookie-accept-button';
  var COOKIE_REJECT_BUTTON = '#cookie-reject-button'
  var COOKIE_BAR_HIDE_BUTTON_ACCEPTED = '#cookie-bar-hide-button-accepted';
  var COOKIE_BAR_HIDE_BUTTON_REJECTED = '#cookie-bar-hide-button-rejected';

  /**
   * Initialises the cookies_options namespace. Should be called prior to use.
   * @public
   */
  cookies_options.initialise = function () {
    registerEvents();
    setVisibility();
  }

  cookies_options.enable_analytics = function () {
    $(COOKIES_BANNER).hide()
    $(COOKIES_BANNER_ACCEPTED).show()
    $(COOKIES_BANNER_REJECTED).hide()
    GOVUK.cookie('cookie_options', 'enable_analytics=true,hide_cookie_bar=true', { days: 365 });
  }

  cookies_options.disable_analytics = function () {
    $(COOKIES_BANNER).hide()
    $(COOKIES_BANNER_REJECTED).show()
    $(COOKIES_BANNER_ACCEPTED).hide()
    GOVUK.cookie('cookie_options', 'enable_analytics=false,hide_cookie_bar=true', { days: 365 });
  }

  cookies_options.options_status = function () {
    return { "analytics_enabled": analytics_enabled(), "cookie_bar_hidden": cookie_bar_hidden() }
  }

  function analytics_enabled () {
    var options_cookie = GOVUK.cookie('cookie_options');
    if (options_cookie == null) {
      return null;
    }
    var match = options_cookie.match(/enable_analytics=(\w+)/);
    return match[1] === "true";
  }

  function cookie_bar_hidden () {
    var options_cookie = GOVUK.cookie('cookie_options');
    if (options_cookie == null) {
      return false;
    }
    var match = options_cookie.match(/hide_cookie_bar=(\w+)/);
    return match[1] === "true";
  }

  /**
   * Set initial visibility.
   * @private
   */
  function setVisibility () {
    $(COOKIES_BANNER).hide()
    $(COOKIES_BANNER_ACCEPTED).hide()
    $(COOKIES_BANNER_REJECTED).hide()

    if (!cookie_bar_hidden()) {
      analytics = analytics_enabled()
      if (analytics === true){
        $(COOKIES_BANNER_ACCEPTED).show()
      } else if (analytics === false){
        $(COOKIES_BANNER_REJECTED).show()
      } else {
        $(COOKIES_BANNER).show()
      } 
    }

  }

  /**
   * Registers all cookie events.
   * @private
   */
   function registerEvents () {
    $(COOKIE_ACCEPT_BUTTON).click(function () {
      $(COOKIES_BANNER).hide()
      $(COOKIES_BANNER_ACCEPTED).show()
      $(COOKIES_BANNER_REJECTED).hide()
      GOVUK.cookie('cookie_options', 'enable_analytics=true,hide_cookie_bar=false', { days: 365 });
    });
    $(COOKIE_REJECT_BUTTON).click(function () {
      $(COOKIES_BANNER).hide()
      $(COOKIES_BANNER_REJECTED).show()
      $(COOKIES_BANNER_ACCEPTED).hide()
      GOVUK.cookie('cookie_options', 'enable_analytics=false,hide_cookie_bar=false', { days: 365 });
    });
    $(COOKIE_BAR_HIDE_BUTTON_ACCEPTED).click(function () {
      $(COOKIES_BANNER).hide()
      $(COOKIES_BANNER_ACCEPTED).hide()
      $(COOKIES_BANNER_REJECTED).hide()
      GOVUK.cookie('cookie_options', 'enable_analytics=true,hide_cookie_bar=true', { days: 365 });
    });
    $(COOKIE_BAR_HIDE_BUTTON_REJECTED).click(function () {
      $(COOKIES_BANNER).hide()
      $(COOKIES_BANNER_REJECTED).hide()
      $(COOKIES_BANNER_ACCEPTED).hide()
      GOVUK.cookie('cookie_options', 'enable_analytics=false,hide_cookie_bar=true', { days: 365 });
    });
  }

})(cookies_options);

cookies_options.initialise();