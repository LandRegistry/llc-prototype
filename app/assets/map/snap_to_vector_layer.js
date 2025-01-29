/*global ol map mastermap_api_key*/

var SNAP_TO_VECTOR_LAYER = {}

var vectorSourceLines = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function(extent) {
        return wfs_server_url + '/' + mastermap_api_key  + '/wfs?service=WFS&' +
            'version=1.1.0&request=GetFeature&typename=PSMA:os.mm.topo.topographicline,PSMA:os.mm.topo.boundaryline&' +
            'outputFormat=application/json&srsname=EPSG:27700&' +
            'bbox=' + extent.join(',')
    },
    strategy: ol.loadingstrategy.bbox
});

SNAP_TO_VECTOR_LAYER.layer = new ol.layer.Vector({
    source: vectorSourceLines,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 0)',
            width: 1
        })
    })
})

SNAP_TO_VECTOR_LAYER.vectorsOnMap = false

SNAP_TO_VECTOR_LAYER.enable = function() {
    if (!SNAP_TO_VECTOR_LAYER.vectorsOnMap) {
        map.addLayer(SNAP_TO_VECTOR_LAYER.layer)
        SNAP_TO_VECTOR_LAYER.vectorsOnMap = true
    }
}

SNAP_TO_VECTOR_LAYER.disable = function() {
    if (SNAP_TO_VECTOR_LAYER.vectorsOnMap) {
        map.removeLayer(SNAP_TO_VECTOR_LAYER.layer)
        SNAP_TO_VECTOR_LAYER.vectorsOnMap = false
    }
}
