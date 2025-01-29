/*global ol MAP_CONFIG map $ GEOSERVER_CONFIG*/

var MAP_HELPERS = {};

// This function will return the current zoom level.
// If the zoom level is undefined it will return the max zoom level.
// The map.getView().getZoom() function returns undefined when loading the search page with a search term saved in session (eg. when refreshing the page after searching).
// This function resolves the issue where no extents are drawn on the map when the page is initially loaded and zooms into the extent area.
// This is due to a rounding error when the zoom level is calculated to be outside of the resolution constraints
(function(MAP_HELPERS) {
    MAP_HELPERS.get_zoom_level = function(map) {
        var current_zoom_level = map.getView().getZoom()
        if (current_zoom_level || current_zoom_level === 0) {
            return Math.round(current_zoom_level)
        } else {
            return MAP_CONFIG.max_zoom_level;
        }
    };

    MAP_HELPERS.zoom_to_boundary = function(organisation) {
        // handle the authority which have apostrophes in them
        var organisation_escaped = organisation.replace("&#39;","\'")

        $.getJSON($SCRIPT_ROOT + '/_authorities/' + encodeURIComponent(organisation_escaped) + '/boundingbox')
            .done(function(json){
                var geojson = new ol.format.GeoJSON();
                var feature = geojson.readFeature(json);
                extent = feature.getGeometry().getExtent();
                map.getView().fit(extent, {constrainResolution: false, duration: 500, easing: ol.easing.linear});
            })
            .fail(function(json) {
                extent = new ol.extent.boundingExtent([[137738.0354,383.7986],[633717.1256,669903.6353]]);
                map.getView().fit(extent, {constrainResolution: false, duration: 500, easing: ol.easing.linear});
            });
    };

    // Ensures that tabbing order for controls is correct by defining the order in which controls are added to the map
    MAP_HELPERS.init_controls = function(map, controls) {
      // hide the default controls and replace with GDS buttons
        if(controls){
          map.addControl(controls);
          map.addControl(new ol.control.Zoom());
        }
        map.addControl(new ol.control.ScaleLine());
        map.addControl(new ol.control.Attribution({collapsed: false, collapsible: false}));
    };

    // Fixes issue where user can triple-click after drawing a polygon to potentially draw more shapes than intended.
    // Checks if draw interaction is still active and the polygon button is disabled.
    // If true, the draw interaction is removed.
    MAP_HELPERS.remove_interaction_if_add_area_button_disabled = function(map) {
        var polygonButtonDisabled = $('#map-button-add-area').prop('disabled');

        if (polygonButtonDisabled) {
            map.getInteractions().forEach(function (interaction) {
                if(interaction instanceof ol.interaction.Draw) {
                    map.removeInteraction(interaction);
                }
            });
        }
    }
})(MAP_HELPERS);
