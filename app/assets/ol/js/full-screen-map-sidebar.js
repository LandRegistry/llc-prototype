/* global $ */
var sidebar = sidebar || {};

/** Defines functionality for the map's sidebar. */
(function (sidebar) {
  var SIDEBAR = '#full-screen-map-sidebar';
  var MAP = '#map';
  var EXPAND_CLOSE_BUTTON = '#expand-close-button';

  /**
   * Initialises the sidebar namespace. Should be called prior to use.
   * @public
   */
  sidebar.initialise = function () {
    registerEvents();
  }

  /**
   * Expand the map's sidebar.
   * @public
   */
  sidebar.expandSidebar = function () {
    $(SIDEBAR).fadeToggle();
    $(EXPAND_CLOSE_BUTTON).removeClass('open-sidebar-button');
    $(EXPAND_CLOSE_BUTTON).addClass('close-sidebar-button');
    $(MAP).removeClass('full-screen-map');
    $(MAP).addClass('two-thirds-map');
    map.updateSize();
  }

  /**
   * Collapse the map's sidebar.
   * @public
   */
  sidebar.collapseSidebar = function () {
    $(SIDEBAR).fadeToggle();
    $(EXPAND_CLOSE_BUTTON).removeClass('close-sidebar-button');
    $(EXPAND_CLOSE_BUTTON).addClass('open-sidebar-button');
    $(MAP).removeClass('two-thirds-map');
    $(MAP).addClass('full-screen-map');
    map.updateSize();
  }

  /**
   * Registers all sidebar events.
   * @private
   */
  function registerEvents () {
    /**
     * Onclick event that expands and collapses the sidebar.
     */
    $(EXPAND_CLOSE_BUTTON).click(function () {
      if ($(this).hasClass('close-sidebar-button')) {
        sidebar.collapseSidebar();
      } else {
        sidebar.expandSidebar();
      }
    })
  }
})(sidebar);
