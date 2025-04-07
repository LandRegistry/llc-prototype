/**
 * ol-ext - A set of cool extensions for OpenLayers (ol) in node modules structure
 * @description ol3,openlayers,popup,menu,symbol,renderer,filter,canvas,interaction,split,statistic,charts,pie,LayerSwitcher,toolbar,animation
 * @version v3.1.7
 * @author Jean-Marc Viglino
 * @see https://github.com/Viglino/ol-ext#,
 * @license BSD-3-Clause
 */
/** @namespace  ol.ext
 */
/*global ol*/
if (window.ol && !ol.ext) {
  ol.ext = {};
}
/** Inherit the prototype methods from one constructor into another.
 * replace deprecated ol method
 *
 * @param {!Function} childCtor Child constructor.
 * @param {!Function} parentCtor Parent constructor.
 * @function module:ol.inherits
 * @api
 */
ol.ext.inherits = function(child,parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
};
// Compatibilty with ol > 5 to be removed when v6 is out
if (window.ol) {
  if (!ol.inherits) ol.inherits = ol.ext.inherits;
}
/* IE Polyfill */
// NodeList.forEach
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
// Element.remove
if (window.Element && !Element.prototype.remove) {
  Element.prototype.remove = function() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }
}
/* End Polyfill */

/*	Copyright (c) 2017 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Interaction to draw holes in a polygon.
 * It fires a drawstart, drawend event when drawing the hole
 * and a modifystart, modifyend event before and after inserting the hole in the feature geometry.
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @fires drawstart
 * @fires drawend
 * @fires modifystart
 * @fires modifyend
 * @param {olx.interaction.DrawHoleOptions} options extend olx.interaction.DrawOptions
 * 	@param {Array<ol.layer.Vector> | function | undefined} options.layers A list of layers from which polygons should be selected. Alternatively, a filter function can be provided. default: all visible layers
 * 	@param { ol.style.Style | Array<ol.style.Style> | StyleFunction | undefined }	Style for the selected features, default: default edit style
 */
ol.interaction.DrawHole = function(options) {
  if (!options) options = {};
  var self = this;
  // Select interaction for the current feature
  this._select = new ol.interaction.Select({ style: options.style });
  this._select.setActive(false);
  // Geometry function that test points inside the current
  var geometryFn, geomFn = options.geometryFunction;
  if (geomFn) {
    geometryFn = function(c,g) {
      g = self._geometryFn (c, g);
      return geomFn (c,g);
    }
  } else {
    geometryFn = function(c,g) { return self._geometryFn (c, g); }
  }
  // Create draw interaction
  options.type = "Polygon";
  options.geometryFunction = geometryFn;
  // Small bodge to allow ES6 OL to work with ES5 ol-ext
  Object.assign(this, new ol.interaction.Draw(options));
  this.prototype = Object.create(ol.interaction.Draw.prototype);
  // Layer filter function
  if (options.layers) {
    if (typeof (options.layers) === 'function') {
      this.layers_ = options.layers;
    } else if (options.layers.indexOf) {
      this.layers_ = function(l) {
        return (options.layers.indexOf(l) >= 0); 
      };
    }
  }
  // Start drawing if inside a feature
  this.on('drawstart', this._startDrawing.bind(this));
  // End drawing add the hole to the current Polygon
  this.on('drawend', this._finishDrawing.bind(this));
};
ol.ext.inherits(ol.interaction.DrawHole, ol.interaction.Draw);
/**
 * Remove the interaction from its current map, if any,  and attach it to a new
 * map, if any. Pass `null` to just remove the interaction from the current map.
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.interaction.DrawHole.prototype.setMap = function(map) {
  if (this.getMap()) this.getMap().removeInteraction(this._select);
  if (map) map.addInteraction(this._select);
  ol.interaction.Draw.prototype.setMap.call (this, map);
};
/**
 * Activate/deactivate the interaction
 * @param {boolean}
 * @api stable
 */
ol.interaction.DrawHole.prototype.setActive = function(b) {
  this._select.getFeatures().clear();
  ol.interaction.Draw.prototype.setActive.call (this, b);
};
/**
 * Remove last point of the feature currently being drawn 
 * (test if points to remove before).
 */
ol.interaction.DrawHole.prototype.removeLastPoint = function() {
  if (this._feature && this._feature.getGeometry().getCoordinates()[0].length>2) {
    ol.interaction.Draw.prototype.removeLastPoint.call(this);
  }
};
/** 
 * Get the current polygon to hole
 * @return {ol.Feature}
 */
ol.interaction.DrawHole.prototype.getPolygon = function() {
  return this._polygon;
  // return this._select.getFeatures().item(0).getGeometry();
};
/**
 * Get current feature to add a hole and start drawing
 * @param {ol.interaction.Draw.Event} e
 * @private
 */
ol.interaction.DrawHole.prototype._startDrawing = function(e) {
  var map = this.getMap();
  var layersFilter = this.layers_;
  this._feature = e.feature;
  var coord = e.feature.getGeometry().getCoordinates()[0][0];
  // Check object under the pointer
  var features = map.getFeaturesAtPixel(
    map.getPixelFromCoordinate(coord), {
      layerFilter: layersFilter
    }
  );
  this._current = null;
  if (features) {
    for (var k=0; k<features.length; k++) {
      var poly = features[k].getGeometry();
      if (poly.getType() === "Polygon"
        && poly.intersectsCoordinate(coord)) {
        this._polygonIndex = false;
        this._polygon = poly;
        this._current = features[k];
      }
      else if (poly.getType() === "MultiPolygon"
        && poly.intersectsCoordinate(coord)) {
        for (var i=0, p; p=poly.getPolygon(i); i++) {
          if (p.intersectsCoordinate(coord)) {
            this._polygonIndex = i;
            this._polygon = p;
            this._current = features[k];
            break;
          }
        }
      }
      if (this._current) break;
    }
  }
  this._select.getFeatures().clear();
  if (!this._current) {
    this.setActive(false);
    this.setActive(true);
  } else {
    this._select.getFeatures().push(this._current);
  }
};
/**
 * Stop drawing and add the sketch feature to the target feature. 
 * @param {ol.interaction.Draw.Event} e
 * @private
 */
ol.interaction.DrawHole.prototype._finishDrawing = function(e) {
  // The feature is the hole
  e.hole = e.feature;
  // Get the current feature
  e.feature = this._select.getFeatures().item(0);
  this.dispatchEvent({ type: 'modifystart', features: [ this._current ] });
  // Create the hole
  var c = e.hole.getGeometry().getCoordinates()[0];
  if (c.length > 3) {
    if (this._polygonIndex!==false) {
      var geom = e.feature.getGeometry();
      var newGeom = new ol.geom.MultiPolygon([]);
      for (var i=0, pi; pi=geom.getPolygon(i); i++) {
        if (i===this._polygonIndex) {
          pi.appendLinearRing(new ol.geom.LinearRing(c));
          newGeom.appendPolygon(pi);
        } else {
          newGeom.appendPolygon(pi);
        }
      }
      e.feature.setGeometry(newGeom);
    } else {
      this.getPolygon().appendLinearRing(new ol.geom.LinearRing(c));
    }
  }
  this.dispatchEvent({ type: 'modifyend', features: [ this._current ] });
  // reset
  this._feature = null;
  this._select.getFeatures().clear();
};
/**
 * Function that is called when a geometry's coordinates are updated.
 * @param {Array<ol.coordinate>} coordinates
 * @param {ol.geom.Polygon} geometry
 * @return {ol.geom.Polygon}
 * @private
 */
ol.interaction.DrawHole.prototype._geometryFn = function(coordinates, geometry) {
  var coord = coordinates[0].pop();
  if (!this.getPolygon() || this.getPolygon().intersectsCoordinate(coord)) {
    this.lastOKCoord = [coord[0],coord[1]];
  }
  coordinates[0].push([this.lastOKCoord[0],this.lastOKCoord[1]]);
  if (geometry) {
    geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
  } else {
    geometry = new ol.geom.Polygon(coordinates);
  }
  return geometry;
};