/*global MAP_CONTROLS MAP_CONFIG document ol draw_layer_styles*/

var MAP_UNDO = {};

MAP_UNDO.undo_stack = [];
MAP_UNDO.drawing = false;

MAP_UNDO.store_state = function() {
    MAP_UNDO.undo_stack.push(MAP_UNDO.get_geometries());
    // Limit growth of undo stack [AC3]
    if(MAP_UNDO.undo_stack.length > 10) {
        MAP_UNDO.undo_stack = MAP_UNDO.undo_stack.slice(MAP_UNDO.undo_stack.length - 10)
    }
    MAP_UNDO.enable_undo_button(true);
};

MAP_UNDO.undo = function() {
    if(MAP_UNDO.drawing) {
        MAP_UNDO.openlayers_undo();
    } else {
        MAP_UNDO.remove_undo();
    }
};

MAP_UNDO.openlayers_undo = function() {
    MAP_CONTROLS.current_interaction.removeLastPoint();
};

MAP_UNDO.remove_undo = function() {

    if(MAP_UNDO.undo_stack.length > 0) {
        MAP_UNDO.put_geometries(MAP_UNDO.undo_stack.pop());
    }
    
    MAP_UNDO.enable_undo_button(MAP_UNDO.undo_stack.length > 0);
    MAP_CONTROLS.removeActiveControl();
};

MAP_UNDO.enable_undo_button = function(enable) {
    document.getElementById('map-button-undo').disabled = !enable;
};

MAP_UNDO.get_geometries = function() {
    var geojson = new ol.format.GeoJSON();
    var features = MAP_CONFIG.draw_source.getFeatures();

    var options = {
        dataProjection: 'EPSG:27700',
        featureProjection: 'EPSG:27700'
    }

    var features_json = geojson.writeFeatures(features, options);
    return features_json;
};

MAP_UNDO.put_geometries = function(geometry) {
    var options = {
        dataProjection: 'EPSG:27700',
        featureProjection: 'EPSG:27700'
    };

    MAP_CONFIG.draw_source.clear();
    var features = new ol.format.GeoJSON().readFeatures(geometry, options);

    MAP_CONFIG.draw_source.addFeatures(features);
};
