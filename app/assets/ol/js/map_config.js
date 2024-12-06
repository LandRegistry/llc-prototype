/*global proj4 ol MAP_CONTROLS draw_layer_styles mastermap_api_key document MAP_UNDO*/
// Define British National Grid Projection - we'll use this to convert points to/from OpenLayers ESPG:3857 Format
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs');
ol.proj.proj4.register(proj4);

var MAP_CONFIG = {};
var hideMaintenanceText, maintenanceAltText, maintenanceText, infoNotAvailableKey, infoNotAvailable,
    infoNeverAvailableKey, infoNeverAvailable, termsLine1, termsLine2, osText, linkText;

(function (MAP_CONFIG) {
    // Map Default Position
    MAP_CONFIG.default_center = [385727.58, 335143.72];
    MAP_CONFIG.default_zoom = 0;
    MAP_CONFIG.vectorControlsZoomThreshold = 13;
    MAP_CONFIG.max_zoom_level = 17;
    MAP_CONFIG.draw_control_id = 'draw-controls';

/*     MAP_CONFIG.base_layer_zindex = 0;
    MAP_CONFIG.boundary_layer_zindex = 1;
    MAP_CONFIG.non_migrated_layer_zindex = 2;
    MAP_CONFIG.llc_layer_zindex = 3; */
    MAP_CONFIG.draw_layer_zindex = 2;
    MAP_CONFIG.charge_layer_zindex = 0;
    MAP_CONFIG.highlighted_charge_layer_zindex = 1;

    // Draw Source
    MAP_CONFIG.draw_features = new ol.Collection();
    MAP_CONFIG.draw_source = new ol.source.Vector({
        features: MAP_CONFIG.draw_features
    });
    MAP_CONFIG.draw_layer = new ol.layer.Vector({
      name:"draw_layer",
      source: MAP_CONFIG.draw_source,
      // style: draw_layer_styles.style[draw_layer_styles.NONE],
      style: draw_layer_styles.style[draw_layer_styles.DRAW],
      zIndex: MAP_CONFIG.draw_layer_zindex
    });
    
    // add charge layer
    MAP_CONFIG.charge_features = new ol.Collection();
    MAP_CONFIG.charge_source = new ol.source.Vector({
        features: MAP_CONFIG.charge_features
    });
    MAP_CONFIG.charge_layer = new ol.layer.Vector({
      name:"charge_layer",
      source: MAP_CONFIG.charge_source,
      style: draw_layer_styles.style[draw_layer_styles.EDIT],
      zIndex: MAP_CONFIG.charge_layer_zindex
    });    
    // add GUIDE layer
    MAP_CONFIG.guide_features = new ol.Collection();
    MAP_CONFIG.guide_source = new ol.source.Vector({
        features: MAP_CONFIG.guide_features
    });
    MAP_CONFIG.guide_layer = new ol.layer.Vector({
      name:"guide_layer",
      source: MAP_CONFIG.guide_source,
      style: draw_layer_styles.style[draw_layer_styles.GUIDE],
      zIndex: MAP_CONFIG.guide_layer_zindex
    });

    // add charge highlight layer
    MAP_CONFIG.charge_highlight_features = new ol.Collection();
    MAP_CONFIG.charge_highlight_source = new ol.source.Vector({
        features: MAP_CONFIG.charge_highlight_features
    });
    MAP_CONFIG.charge_highlight_layer = new ol.layer.Vector({
      name:"highlight_layer",
      source: MAP_CONFIG.charge_highlight_source,
      style: draw_layer_styles.style[draw_layer_styles.DELETE],
      zIndex: MAP_CONFIG.highlighted_charge_layer_zindex
    });

    MAP_CONFIG.charge_layer.setStyle(draw_layer_styles.DELETE);
    MAP_CONFIG.charge_highlight_layer.setStyle(draw_layer_styles.DELETE);


    MAP_CONFIG.projection = ol.proj.get('EPSG:27700');
    // Fixed resolutions to display the map at (pixels per ground unit (meters when
    // the projection is British National Grid))
    MAP_CONFIG.resolutions = [
        //res level scale
        2800.0000, // 0 10000000.0
        1400.0000, // 1 5000000.0
        700.0000, // 2 2500000.0
        280.0000, // 3 1000000.0
        140.0000, // 4 500000.0
        70.0000, // 5 250000.0
        28.0000, // 6 100000.0
        21.0000, // 7 75000.0
        14.0000, // 8 50000.0
        7.0000, // 9 25000.0
        2.8000, // 10 10000.0
        1.4000, // 11 5000.0
        0.7000, // 12 2500.0
        0.3500, // 13 1250.0
        0.1750, // 14 625.0
        0.0875, // 15 312.5
        0.0435, // 16 
        0.0217 // 17
    ];

    // Smaller list of resolutions to enable higher zoom on lower quality tiles
    MAP_CONFIG.mastermapResolutions = [
        //res level scale
        2800.0000, // 0 10000000.0
        1400.0000, // 1 5000000.0
        700.0000, // 2 2500000.0
        280.0000, // 3 1000000.0
        140.0000, // 4 500000.0
        70.0000, // 5 250000.0
        28.0000, // 6 100000.0
        21.0000, // 7 75000.0
        14.0000, // 8 50000.0
        7.0000, // 9 25000.0
        2.8000, // 10 10000.0
        1.4000, // 11 5000.0
        0.7000, // 12 2500.0
        0.3500, // 13 1250.0
        0.1750, // 14 625.0
        0.0875, // 15 312.5
    ];

    // Master Map Vector Layer
    MAP_CONFIG.snap_to = new MAP_CONTROLS.snap_to();
    MAP_CONFIG.vectorControls = MAP_CONTROLS.vectorControls;

    MAP_CONFIG.setBaseLayer  = function (zIndex, res, proj, osTermsLink, maintenance) {
        MAP_CONFIG.base_layer = MAP_CONFIG.createBaseLayer(zIndex, res, proj, osTermsLink, maintenance);
    };

})(MAP_CONFIG);

MAP_CONFIG.draw_features.on('change:length', function (event) {
    var count = MAP_CONFIG.draw_features.getLength();
    MAP_CONTROLS.enableControls(count !== 0);
});

MAP_CONFIG.createBaseLayer = function (zIndex, res, proj, osTermsLink, maintenance) {

    var getTermsAndConditions = function (osTermsLink, maintenance) {
      var hideMaintenance = '<a href="#" id="toggleMaintenance" onclick="hideMaintenanceLayer()">' + hideMaintenanceText + '</a>';
      var mapKey1 = maintenance ? '<span class="map-key"><img src="/public/ol/images/information_maintenance.png" alt="' + maintenanceAltText + '" height="19" width="19"> = ' + maintenanceText + hideMaintenance + '</span><br>' : '';
      var mapKey2 = '<span class="map-key"><img src="/public/ol/images/information_not_available.png" alt="' + infoNotAvailableKey + '" height="19" width="19"> = ' + infoNotAvailable + '</span><br>';
      var mapKey3 = '<span class="map-key"><img src="/public/ol/images/information_never_available.png" alt="' + infoNeverAvailableKey + '" height="19" width="19"> = ' + infoNeverAvailable + '</span><br>';
      var termsLine3 = '<a href="' + osTermsLink + '" target="_blank">' + osText + '</a>'
      return mapKey1 + mapKey2 + mapKey3 + termsLine1 + '<br>' + termsLine2 + '<br>' + termsLine3 + linkText;
    };

    // Extent of the map in units of the projection (these match our base map)
    var extent = [0, 0, 700000, 1300000];

    proj = ol.proj.get('EPSG:27700');
    proj.setExtent(extent);

    return new ol.layer.Tile({
        extent: extent,
        opacity: 1.0,
        source: new ol.source.TileImage({
            attributions: "",//getTermsAndConditions(osTermsLink, maintenance),
            crossOrigin: null,
            projection: proj,
            tileGrid: new ol.tilegrid.TileGrid({
                origin: [extent[0], extent[1]],
                resolutions: res
            }),
            tileUrlFunction: function (tileCoord, pixelRatio, projection) {
                if (!tileCoord) {
                    return "";
                }

                var x = tileCoord[1];
                var y = -1 - tileCoord[2];
                var z = tileCoord[0];

                if (x < 0 || y < 0) {
                    return "";
                }
                
                var url = wmts_server_url + '/' + mastermap_api_key + '/' + map_base_layer_view_name + '/' + z + '/' + x + '/' + y + '.png';
                return url;
            }
        }),
        zIndex: zIndex
    });
};
