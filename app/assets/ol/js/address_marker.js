var AddressMarker = function (staticContentPath) {

    var self = this;

    self.staticContentPath = staticContentPath;

    self.addressMarkerSource = new ol.source.Vector({});

    self.addressMarkerLayer = new ol.layer.Vector({
        source: this.addressMarkerSource
    });

    self.addressMarkerStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            src: self.staticContentPath + '/images/icon-locator.png',
            anchor: [0.5, 1]
        }))
    });

    self.markAddressLocation = function (addressGeometry) {
        self.addressMarkerSource.clear();

        var geoJson = {
            'type': 'Feature',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:27700'
                }
            },
            'geometry': addressGeometry
        };

        var options = {
            'dataProjection': 'EPSG:27700',
            'featureProjection': 'EPSG:27700'
        };

        var pin = (new ol.format.GeoJSON()).readFeature(geoJson, options);
        pin.setStyle(self.addressMarkerStyle);

        self.addressMarkerSource.addFeature(pin);
    };
};
