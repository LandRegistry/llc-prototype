/*global MAP_CONFIG ol document GEOSERVER_CONFIG MAP_HELPERS MAP_CONTROLS draw_layer_styles*/

var map = new ol.Map({
    layers: [
      MAP_CONFIG.base_layer,
      /*    
      GEOSERVER_CONFIG.boundaries_layer,
      GEOSERVER_CONFIG.maintenance_layer,
      */
      // add layers for highlights
      MAP_CONFIG.guide_layer,
      MAP_CONFIG.charge_layer,
      MAP_CONFIG.charge_highlight_layer,
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

let selected = null;
const selectStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: '#eeeeee',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2,
  }),
});

map.on('pointermove', function(browserEvent) {

  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

    var pixel = browserEvent.pixel;
    document.body.style.cursor = '';

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer == MAP_CONFIG.draw_layer && MAP_CONTROLS.current_style == draw_layer_styles.REMOVE) {
            document.body.style.cursor = 'pointer';
        }
        selected = feature;

        let id = feature.getProperties().id;
        console.log(id);
        
        if(id>999){
          selectStyle.getFill().setColor(feature.get('COLOR') || '#eeeeee');
          feature.setStyle(selectStyle);
        }
        return true;
    })
    console.log(selected);
    
    if (selected) {
     // status.innerHTML = selected.get('ECO_NAME');
    } else {
     // status.innerHTML = '&nbsp;';
    }
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

map.on('click', function(e) {
  var count = 0;
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    let layer_name = layer.getProperties().name;
    let id = feature.getProperties().id;

    console.log(layer_name, id);
    if(layer_name === "charge_layer"){
      showCCA(id);

    }
  })
})


