function populate_geometries(element_id) {
    var geojson = new ol.format.GeoJSON();
    var features = MAP_CONFIG.draw_source.getFeatures();

    var options = {
        dataProjection: 'EPSG:27700',
        featureProjection: 'EPSG:27700'
    }

    var features_json = geojson.writeFeatures(features, options);
    var hiddenField = document.getElementById(element_id)

    hiddenField.setAttribute("value", features_json);
}

function load_previous_data(information) {
    if(information) {
        try {
            var options = {
                dataProjection: 'EPSG:27700',
                featureProjection: 'EPSG:27700'
            }

            var features = new ol.format.GeoJSON().readFeatures(information, options);

            MAP_CONFIG.draw_source.addFeatures(features);
            // default style without hatching
            //MAP_CONFIG.draw_layer.setStyle(draw_layer_styles.style[draw_layer_styles.DRAW])

            if (features.length == 1 && features[0].getGeometry().getType() == "Point"){
                map.getView().animate({
                    center: features[0].getGeometry().getCoordinates(),
                    zoom: 100,
                    duration: 1
                });
            } else {
                var extent = features[0].getGeometry().getExtent().slice(0);

                features.forEach(function (feature) {
                    ol.extent.extend(extent, feature.getGeometry().getExtent());
                });

                map.getView().fit(extent);

                // get the map zoom with the new extents
                const view = map.getView();
                const zoom = view.getZoom();
                // then zoom out slightly to show the context / surrounding area
                view.setZoom(zoom -0.2)
            }
        } catch (e) {
        }
    }
}