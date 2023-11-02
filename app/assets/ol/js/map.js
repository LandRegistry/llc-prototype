/*global MAP_CONFIG ol document GEOSERVER_CONFIG MAP_HELPERS MAP_CONTROLS draw_layer_styles*/

var map = new ol.Map({
    layers: [
      MAP_CONFIG.base_layer,
/*       GEOSERVER_CONFIG.boundaries_layer,
      GEOSERVER_CONFIG.maintenance_layer, */
      MAP_CONFIG.draw_layer
    ],
    logo: false,
    target: 'map',
    controls: [],
    view: new ol.View({
        projection: MAP_CONFIG.projection,
        resolutions: MAP_CONFIG.resolutions,
        center: MAP_CONFIG.default_center,
        zoom: MAP_CONFIG.default_zoom
    })
});

map.on('pointermove', function(browserEvent) {
    var pixel = browserEvent.pixel;
    document.body.style.cursor = '';

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer == MAP_CONFIG.draw_layer && MAP_CONTROLS.current_style == draw_layer_styles.REMOVE) {
            document.body.style.cursor = 'pointer';
        }
    })
});

map.on('moveend', function() {
    if (MAP_HELPERS.get_zoom_level(map) >= MAP_CONFIG.vectorControlsZoomThreshold) {
        if (!MAP_CONFIG.vectorControls.disableOverride) {
            MAP_CONFIG.vectorControls.enableControls()
        }
    } else {
        MAP_CONFIG.vectorControls.disableControls()
    }
});


