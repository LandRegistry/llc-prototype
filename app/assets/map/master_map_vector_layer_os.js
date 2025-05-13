/*global ol map mastermap_api_key*/

var MASTER_MAP_VECTOR_LAYER = {}

/**
 * Return URL with encoded parameters.
 * @param {object} params - The parameters object to be encoded.
 */
function getUrl(params) {
  const encodedParameters = Object.keys(params)
      .map(paramName => paramName + '=' + encodeURI(params[paramName]))
      .join('&');

  return 'https://api.os.uk/features/v1/wfs?' + encodedParameters;
}



// Add a layer for rendering the Airport features on the map.
const vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection) {
      // Convert the bounds to a formatted string.
      let sw = extent[0] + ',' + extent[1],
          ne = extent[2] + ',' + extent[3];
          //ne = parseFloat(extent[0])+0.5 + ',' + parseFloat(extent[1])+0.5;

      let coords = sw + ' ' + ne;
      console.log(coords);
      

      // Create an OGC XML filter parameter value which will select the Airport
      // features (site function) intersecting the BBOX coordinates.
      let xml = '<ogc:Filter>';
      //xml += '<ogc:And>';
      xml += '<ogc:BBOX>';
      xml += '<ogc:PropertyName>SHAPE</ogc:PropertyName>';
      xml += '<gml:Box srsName="' + projection.getCode() + '">';
      xml += '<gml:coordinates>' + coords + '</gml:coordinates>';
      xml += '</gml:Box>';
      xml += '</ogc:BBOX>';
 /*      xml += '<ogc:PropertyIsEqualTo>';
      xml += '<ogc:PropertyName>SiteFunction</ogc:PropertyName>';
      xml += '<ogc:Literal>Airport</ogc:Literal>';
      xml += '</ogc:PropertyIsEqualTo>'; */
      //xml += '</ogc:And>';
      xml += '</ogc:Filter>';

/*       const wfsParams = {
          key: os_api_key,
          service: 'WFS',
          request: 'GetFeature',
          version: '2.0.0',
          typeNames: 'Sites_FunctionalSite',
          outputFormat: 'GEOJSON',
          filter: xml
      }; */
// Define (WFS) parameters object.
/* const wfsParams = {
  key: os_api_key,
  service: 'WFS',
  request: 'GetFeature',
  version: '2.0.0',
  typeNames: 'Topography_TopographicArea',
  propertyName: 'TOID,DescriptiveGroup,SHAPE',
  outputFormat: 'GEOJSON',
  count: 1
}; */

      const wfsParams = {
        key: os_api_key,
        service: 'WFS',
        request: 'GetFeature',
        version: '2.0.0',
        typeNames: 'Topography_TopographicArea',
        propertyName: 'TOID,DescriptiveGroup,SHAPE',
        outputFormat: 'GEOJSON',
        srsName: 'EPSG:27700', 
        filter: xml
      };

      const onError = function() {
          vectorSource.removeLoadedExtent(extent);
      }
      console.log(getUrl(wfsParams));

      // Use fetch() method to request GeoJSON data from the OS Features API.
      // If successful - add the response data to the vector source.
      fetch(getUrl(wfsParams))
          .then(response => response.json())
          .then(data => {
              // Add unique id to each feature to stop duplicates being
              // loaded via the bbox strategy.
              data.features.forEach(function(obj) {
                console.log(obj.properties.OBJECTID);
                
                  obj.id = obj.properties.OBJECTID;
              });

              const format = vectorSource.getFormat();
              const features = format.readFeatures(data, {
                  featureProjection: projection
              });

              vectorSource.addFeatures(features);
          })
          .catch(onError);
  },
  strategy: ol.loadingstrategy.bbox
});

MASTER_MAP_VECTOR_LAYER.layer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 1)',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0)'
        })
    })
})

MASTER_MAP_VECTOR_LAYER.vectorsOnMap = false

MASTER_MAP_VECTOR_LAYER.enable = function() {
    if (!MASTER_MAP_VECTOR_LAYER.vectorsOnMap) {
        map.addLayer(MASTER_MAP_VECTOR_LAYER.layer)
        MASTER_MAP_VECTOR_LAYER.vectorsOnMap = true
    }
}

MASTER_MAP_VECTOR_LAYER.disable = function() {
    if (MASTER_MAP_VECTOR_LAYER.vectorsOnMap) {
        map.removeLayer(MASTER_MAP_VECTOR_LAYER.layer)
        MASTER_MAP_VECTOR_LAYER.vectorsOnMap = false
    }
}
