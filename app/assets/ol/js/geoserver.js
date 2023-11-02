/*global GEOSERVER_CONFIG ol MAP_CONFIG*/
/*exported configureGeoserverLayerForUser*/

var GEOSERVER_CONFIG = {}

GEOSERVER_CONFIG.boundaries_layer;
GEOSERVER_CONFIG.maintenance_layer;

function configureGeoserverLayerForUser(geoserver_url, geoserver_token) {
    GEOSERVER_CONFIG.boundaries_layer = get_boundary_layer(geoserver_url, geoserver_token,
    'authority_boundary_maintain', MAP_CONFIG.boundary_layer_zindex, "boundaries", false);

    GEOSERVER_CONFIG.maintenance_layer = get_boundary_layer(geoserver_url, geoserver_token,
    'authority_boundary_maintain_ance', MAP_CONFIG.boundary_layer_zindex, "maintenance", true);
}

function hideMaintenanceLayer() {
    document.getElementById("toggleMaintenance").onclick = showMaintenanceLayer;
    document.getElementById("toggleMaintenance").innerHTML = "Show";

    map.getLayers().forEach(function (layer) {
        if (layer.get('name') != undefined && layer.get('name') === 'maintenance') {
            layer.setVisible(false);
        };
        if (layer.get('name') != undefined && layer.get('name') === 'boundaries') {
            layer.setVisible(true);
        };
    });
}

function showMaintenanceLayer() {
    document.getElementById("toggleMaintenance").onclick = hideMaintenanceLayer;
    document.getElementById("toggleMaintenance").innerHTML = "Hide"

    map.getLayers().forEach(function (layer) {
        if (layer.get('name') != undefined && layer.get('name') === 'maintenance') {
            layer.setVisible(true);
        };
        if (layer.get('name') != undefined && layer.get('name') === 'boundaries') {
            layer.setVisible(false);
        };
    });
}

function get_boundary_layer(geoserver_url, geoserver_token, style, layer_zindex, layer_name, is_visible) {
    var params = {
        'LAYERS': 'llc:boundaries_organisation_combined',
        'VERSION': '1.1.1',
        'FORMAT': 'image/png',
        'TILED': true,
        'STYLES': style
    };

    var layer = new ol.layer.Tile({
        name: layer_name,
        source: new ol.source.TileWMS({
            url: geoserver_url + '/geoserver/llc/' + geoserver_token + '/wms?',
            params: params
        }),
        zIndex: layer_zindex,
        visible: is_visible
    });

    return layer;
}
