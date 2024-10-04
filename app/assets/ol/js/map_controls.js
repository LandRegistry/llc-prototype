/*global document, ol, draw_layer_styles, MAP_UNDO, MAP_CONFIG, $, map, MASTER_MAP_VECTOR_LAYER*/
var staticContentUrl;

var MAP_CONTROLS = {}
var undoArrowText, undoText, addPointText, addLineText, addAreaText, addCircleText, editAreaText, deleteAreaText, clearAllText,
    cutOutText, snapToMapText, copyText;

MAP_CONTROLS.addAreaButtonId = 'map-button-add-area';
MAP_CONTROLS.editButtonId = 'map-button-edit';
MAP_CONTROLS.copyButtonId = 'map-button-copy';
MAP_CONTROLS.undoButtonId = 'map-button-undo';
MAP_CONTROLS.clearAllButtonId = 'map-button-clear-all';
MAP_CONTROLS.snapToButtonId = 'snap-to-checkbox';
MAP_CONTROLS.checkBox = 'checkbox';
MAP_CONTROLS.cutHoleButtonId = 'map-button-draw-hole';
MAP_CONTROLS.deleteButtonId = 'map-button-delete';
MAP_CONTROLS.pointButtonId = 'map-button-point';
MAP_CONTROLS.lineButtonId = 'map-button-line'
MAP_CONTROLS.circleButtonId = 'map-button-circle'

MAP_CONTROLS.current_interaction = null;
MAP_CONTROLS.hover_interaction = null;
MAP_CONTROLS.current_style = draw_layer_styles.DRAW;//NONE
// Used to generate IDs for newly created features
MAP_CONTROLS.feature_id = 0;

// Toolbar Of Available Map Controls
MAP_CONTROLS.Controls = function(controls) {
    var container = document.createElement('div');
    var noOfControls = controls.length;

    container.id = MAP_CONFIG.draw_control_id;
    container.className = "ol-control";

    for (i = 0; i < noOfControls; i++) {
        container.appendChild(controls[i]);
    }

    return new ol.control.Control({
        element: container
    });
};
//function used to create all buttons
function createButton(id, title, disabled, isUndo, clickEvent){
    var button = document.createElement('button');
    button.setAttribute('id', id);
    button.setAttribute('class', id);
    button.setAttribute('aria-label', title);
    button.disabled = disabled;
    if (isUndo){
        var undoImg = document.createElement('img');
        undoImg.setAttribute('src', staticContentUrl + '/ol/images/undo.png');
        undoImg.setAttribute('class', 'undo-img');
        undoImg.setAttribute('alt', undoArrowText);
        undoImg.setAttribute('height', '15px');
        button.appendChild(undoImg);
    }

    var span = document.createElement('span');
    span.setAttribute('class', 'control-title');
    span.textContent = title;
    button.appendChild(span);

    button.addEventListener('click', clickEvent);
    return button
}

var ol_ext_inherits = function(child,parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};

ol_ext_inherits(MAP_CONTROLS.Controls, ol.control.Control);

MAP_CONTROLS.undo_button = function() {
    return createButton(MAP_CONTROLS.undoButtonId, undoText, true, true, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Undo button clicked'});
        MAP_UNDO.undo();

    }) 
}

// Draw Point Button
MAP_CONTROLS.point_button = function() {
    return createButton(MAP_CONTROLS.pointButtonId, addPointText, false, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Point button clicked'});
        MAP_CONTROLS.add_draw_interaction("Point", $('#' + MAP_CONTROLS.pointButtonId));
    })
};

// Draw Line Button
MAP_CONTROLS.line_button = function() {
    return createButton(MAP_CONTROLS.lineButtonId, addLineText, false, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Draw line button clicked'});
        MAP_CONTROLS.add_draw_interaction("LineString", $('#' + MAP_CONTROLS.lineButtonId));
    })
};

// Draw Polygon Button
MAP_CONTROLS.add_area_button = function() {
    return createButton(MAP_CONTROLS.addAreaButtonId, addAreaText, false, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Draw polygon button clicked'});
        MAP_CONTROLS.add_draw_interaction("Polygon", $('#' + MAP_CONTROLS.addAreaButtonId));
    })
};

// Draw Circle Button
MAP_CONTROLS.circle_button = function() {
    return createButton(MAP_CONTROLS.circleButtonId, addCircleText, false, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Draw circle button clicked'});
        MAP_CONTROLS.add_draw_interaction("Circle", $('#' + MAP_CONTROLS.circleButtonId));
    })
};

// Edit Features Button
MAP_CONTROLS.edit_button = function() {
    return createButton(MAP_CONTROLS.editButtonId, editAreaText, true, false, function() {
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Edit button clicked'});
        map.removeInteraction(MAP_CONTROLS.current_interaction);
        var toggled_on = MAP_CONTROLS.toggle_button($('#' + MAP_CONTROLS.editButtonId));

        if (toggled_on) {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.EDIT);

            MAP_CONTROLS.current_interaction = new ol.interaction.Modify({
                features: MAP_CONFIG.draw_features,
                style: draw_layer_styles.style[draw_layer_styles.EDIT]
            });

            map.addInteraction(MAP_CONTROLS.current_interaction);
            $("#" + MAP_CONTROLS.editButtonId).trigger("edit:toggled");
            if (MAP_CONTROLS.vectorControls.snap_to_enabled) {
                map.addInteraction(snap_to_interaction)
            }

            MAP_CONTROLS.current_interaction.on('modifystart', function(event) {
                MAP_UNDO.store_state();
            });

        } else {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE);
        }
    })
};

// Remove Features Button
MAP_CONTROLS.remove_button = function() {
    return createButton(MAP_CONTROLS.deleteButtonId, deleteAreaText, true, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Delete single polygon button clicked'});
        map.removeInteraction(MAP_CONTROLS.current_interaction);
        var toggled_on = MAP_CONTROLS.toggle_button($('#' + MAP_CONTROLS.deleteButtonId));

        if (toggled_on) {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.REMOVE);

            MAP_CONTROLS.current_interaction = new ol.interaction.Select({
                layers: [MAP_CONFIG.draw_layer]
            });

            MAP_CONTROLS.current_interaction.getFeatures().on('add', function (event) {
                var feature_id = event.element.getProperties().id;

                MAP_CONTROLS.remove_selected_feature(feature_id);
                MAP_CONTROLS.current_interaction.getFeatures().clear();
            });

            map.addInteraction(MAP_CONTROLS.current_interaction)
        } else {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
        }
    })
};

MAP_CONTROLS.remove_all_button = function() {
    return createButton(MAP_CONTROLS.clearAllButtonId, clearAllText, true, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Remove all button clicked'});
        //MAP_UNDO.store_state();

        map.removeInteraction(MAP_CONTROLS.current_interaction);
        $('.active-control').removeClass('active-control');

        MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
        //console.log(MAP_CONFIG);
        MAP_CONFIG.draw_source.clear();
    })
};

MAP_CONTROLS.draw_hole = function() {
    return createButton(MAP_CONTROLS.cutHoleButtonId, cutOutText, true, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Draw hole button clicked'});
        map.removeInteraction(MAP_CONTROLS.current_interaction);
        var toggled_on = MAP_CONTROLS.toggle_button($('#' + MAP_CONTROLS.cutHoleButtonId));
        if (toggled_on) {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.HOLE);
            
            MAP_CONTROLS.current_interaction = new ol.interaction.DrawHole({
                layers: [MAP_CONFIG.draw_layer],
                style: draw_layer_styles.style[draw_layer_styles.HOLE],
                geometryFunction: function(coords, geometry) {
                    if(!geometry) {
                        geometry = new ol.geom.Polygon([]);
                    }
                    geometry.setCoordinates([coords[0].concat([coords[0][0]])]);
                    MAP_UNDO.drawing = coords[0].length > 1;
                    return geometry;
                }
            });

            map.addInteraction(MAP_CONTROLS.current_interaction);
            $("#" + MAP_CONTROLS.cutHoleButtonId).trigger("edit:toggled");
            if (MAP_CONTROLS.vectorControls.snap_to_enabled) {
                map.addInteraction(snap_to_interaction)
            }

            MAP_CONTROLS.current_interaction.on('drawstart', function(event) {
                MAP_UNDO.store_state();
            });

            MAP_CONTROLS.current_interaction.on('drawend', function(event) {
                MAP_UNDO.drawing = false;
            });
        } else {
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE);
        }
    })
};

// Toggle/Untoggle Control
MAP_CONTROLS.toggle_button = function(button) {
    var jbutton = $(button)
    var is_active_control = jbutton.hasClass('active-control');

    if (is_active_control) {
        jbutton.removeClass('active-control');
        MAP_CONTROLS.current_interaction = null;
        return false
    } else {
        $('.active-control').removeClass('active-control');
        jbutton.addClass('active-control')
        return true
    }
};

// Remove Drawn Feature
MAP_CONTROLS.remove_selected_feature = function(id) {
    MAP_UNDO.store_state();
    var features = MAP_CONFIG.draw_source.getFeatures();
    var feature = $.grep(features, function(feature) { return feature.getProperties().id == id });
    MAP_CONFIG.draw_source.removeFeature(feature[0])
};

// Add Draw Interactions
MAP_CONTROLS.add_draw_interaction = function(type, button) {
    // Remove the previous interaction
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    // remove the toggle of the draw control button as this is handled by the new radio buttons
    // Toggle the draw control as needed
    //var toggled_on = MAP_CONTROLS.toggle_button(button);

    //if (toggled_on) {
        MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

        if (type == "Circle") {
            MAP_CONTROLS.current_interaction = new ol.interaction.Draw({
                features: MAP_CONFIG.draw_features,
                type: type,
                style: draw_layer_styles.style[draw_layer_styles.DRAW],
                geometryFunction: ol.interaction.Draw.createRegularPolygon(25)
            });
    
        } else {

            MAP_CONTROLS.current_interaction = new ol.interaction.Draw({
                features: MAP_CONFIG.draw_features,
                type: type,
                style: draw_layer_styles.style[draw_layer_styles.DRAW],
                geometryFunction: function(coords, geometry) {
                    /* Callback to set drawing to false if all point removed and prevent
                    calls to removeLastPoint when there's no points left to undo */
                    if(type==="LineString") {
                        if(!geometry) {
                            geometry = new ol.geom.LineString([]);
                        }
                        geometry.setCoordinates(coords);
                        MAP_UNDO.drawing = coords.length > 1;
                    } else if(type === "Point") {
                        if(!geometry) {
                            geometry = new ol.geom.Point([]);
                        }
                        geometry.setCoordinates(coords);
                    } else if(type === "Polygon") {
                        if(!geometry) {
                            geometry = new ol.geom.Polygon([]);
                        }
                        geometry.setCoordinates([coords[0].concat([coords[0][0]])]);
                        MAP_UNDO.drawing = coords[0].length > 1;
                    }

                    return geometry;
                }
            });
        }

        MAP_CONTROLS.current_interaction.on('drawend', function (event) {
            event.feature.setProperties({
                'id': Date.now()
            });
        });

        MAP_CONTROLS.current_interaction.on('drawstart', function(event) {
            MAP_UNDO.store_state();
        });

        MAP_CONTROLS.current_interaction.on('drawend', function(event) {
            MAP_UNDO.drawing = false;
        });

        map.addInteraction(MAP_CONTROLS.current_interaction);
        if (MAP_CONTROLS.vectorControls.snap_to_enabled) {
            map.addInteraction(snap_to_interaction)
        }
    //}
};

// Toggle Feature Styles on draw layer for current style
MAP_CONTROLS.toggle_draw_layer_style = function(style) {
  //("current_style" , style);
    // style is one of 4: DRAW, EDIT, REMOVE and NONE
    MAP_CONTROLS.current_style = style;

    //also check the show shading box
    let showHatching  = $('#hatching').is(':checked');
    //console.log("HATCH CHECK " + showHatching);
    let pattern = draw_layer_styles.style[style];
    if (showHatching) {
      pattern = draw_layer_styles.style[style+10];
    } 
   // console.log(style, pattern);

    MAP_CONFIG.draw_layer.setStyle(pattern);


}

// Mastermap vector controls
MAP_CONTROLS.vectorControls = {}

MAP_CONTROLS.vectorControls.disableOverride = false;
MAP_CONTROLS.vectorControls.snap_to_enabled = false;
MAP_CONTROLS.vectorControls.copy_enabled = false;

// Enables the mm vector buttons
MAP_CONTROLS.vectorControls.enableControls = function() {
    var copyButton = $('#' + MAP_CONTROLS.copyButtonId);

    copyButton.removeClass('map-button-disabled');
    copyButton.prop('disabled', false);

    $('#' + MAP_CONTROLS.checkBox).prop('disabled', false);
    $('#' + MAP_CONTROLS.snapToButtonId).removeClass('snap-to-disabled');
};

// Disables the mm vector buttons
MAP_CONTROLS.vectorControls.disable_buttons = function() {
    var copyButton = $('#' + MAP_CONTROLS.copyButtonId);
    var checkBox = $('#' + MAP_CONTROLS.checkBox);

    copyButton.addClass('map-button-disabled');
    copyButton.prop('disabled', true);

    if (checkBox.attr('selected') === 'selected'){
        checkBox.trigger('click');
        checkBox.removeAttr('selected');
    }

    checkBox.prop('disabled', true);
    $('#' + MAP_CONTROLS.snapToButtonId).addClass('snap-to-disabled');
};

// Disables the vector buttons and snap to interaction
MAP_CONTROLS.vectorControls.disableControls = function() {
    MASTER_MAP_VECTOR_LAYER.disable()
    SNAP_TO_VECTOR_LAYER.disable()
    MAP_CONTROLS.vectorControls.disable_buttons()
    MAP_CONTROLS.vectorControls.snap_to_enabled = false
    MAP_CONTROLS.vectorControls.copy_enabled = false;
    $('#' + MAP_CONTROLS.snapToButtonId).removeClass('active-mode');
    $('#' + MAP_CONTROLS.copyButtonId).removeClass('active-control');
    map.removeInteraction(snap_to_interaction)
};

var snap_to_interaction = new ol.interaction.Snap({
    source: SNAP_TO_VECTOR_LAYER.layer.getSource(),
    edge: true,
    vertex: true,
    pixelTolerance: 7.5
});

MAP_CONTROLS.snap_to = function() {
    var snapDiv = document.createElement('div')
    var snapText = document.createElement('label');
    var checkBox = document.createElement('input');
    snapDiv.setAttribute('class', 'checkbox snap-to-disabled');
    snapDiv.setAttribute('id', 'snap-to-checkbox');
    //setsup the checkbox
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('class', 'snap-checkbox');
    checkBox.setAttribute('id', 'checkbox');
    checkBox.setAttribute('disabled', true);
    snapDiv.appendChild(checkBox);
    //sets up the 'snap to text' then adds it to the div
    snapText.setAttribute('class', 'snap-text');
    snapText.setAttribute('for', 'checkbox');
    snapText.innerHTML = snapToMapText;
    snapDiv.appendChild(snapText);

    checkBox.addEventListener('click', function () {
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Snap to button clicked'});
        if (MAP_CONTROLS.vectorControls.snap_to_enabled) {
            // Disable the snap to interaction and vector layer, but not the snap to button
            // Don't disable vector layer if copy active
            if (!MAP_CONTROLS.vectorControls.copy_enabled) {
                SNAP_TO_VECTOR_LAYER.disable()
            }
            map.removeInteraction(snap_to_interaction)
            MAP_CONTROLS.vectorControls.snap_to_enabled = false
            $('#checkbox').removeAttr('selected');
        } else {
            // Enable the snap to interaction and vector layer
            SNAP_TO_VECTOR_LAYER.enable()
            map.addInteraction(snap_to_interaction)
            MAP_CONTROLS.vectorControls.snap_to_enabled = true
            $('#checkbox').attr('selected', 'selected');
    }})
    return snapDiv;
};

MAP_CONTROLS.copy_button = function() {
    return createButton(MAP_CONTROLS.copyButtonId, copyText, true, false, function(){
        //gtag('event', 'Button click', {'eventCategory': 'Map tools', 'eventLabel': 'Copy button clicked'});
        map.removeInteraction(MAP_CONTROLS.current_interaction);
        var toggled_on = MAP_CONTROLS.toggle_button($('#' + MAP_CONTROLS.copyButtonId));

        if (toggled_on) {
            MASTER_MAP_VECTOR_LAYER.enable()
            MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

            MAP_CONTROLS.current_interaction = new ol.interaction.Select({
                layers: [MASTER_MAP_VECTOR_LAYER.layer],
                style: draw_layer_styles.style[draw_layer_styles.DRAW]
            });

            MAP_CONTROLS.current_interaction.getFeatures().on('add', function (event) {
                MAP_UNDO.store_state();
                feature = event.target.item(0).clone();
                if (feature) {
                    geometry = feature.getGeometry();
                    //Convert multi polygons to features
                    if (geometry instanceof ol.geom.MultiPolygon) {
                        geometry.getPolygons().forEach(function(geometry) {
                            MAP_CONTROLS.addGeometryToMap(geometry)
                        })
                    }
                    else {
                        MAP_CONTROLS.addGeometryToMap(geometry)
                    }
                }
            });

            MAP_CONTROLS.vectorControls.copy_enabled = true;
            map.addInteraction(MAP_CONTROLS.current_interaction)
        }
        else if(!MAP_CONTROLS.vectorControls.snap_to_enabled) {
            MAP_CONTROLS.vectorControls.copy_enabled = false;
            MASTER_MAP_VECTOR_LAYER.disable()
        }
    })
};

MAP_CONTROLS.addGeometryToMap = function(geometry) {
    // Convert geometry into geojson as union function requires geojson
    geoJsontoAdd = JSON.parse(new ol.format.GeoJSON().writeGeometry(geometry))
  
    featuresToRemove = []
  
    MAP_CONFIG.draw_source.getFeatures().forEach(function(feature) {
        current_geometry = feature.getGeometry()

        if (current_geometry.getType() === 'Polygon') {
            currentGeoJson = JSON.parse(new ol.format.GeoJSON().writeGeometry(feature.getGeometry()))
    
            mergedGeoJSON = turf.union.default(currentGeoJson, geoJsontoAdd)
            /* If adjecent returns a feature with a polygon
            Else returns a feature with a multi polygon */
    
            if (mergedGeoJSON.geometry.type === 'Polygon') {
                geoJsontoAdd = mergedGeoJSON.geometry
                featuresToRemove.push(feature)
            }
        }
    })
  
    featuresToRemove.forEach(function(feature) {
        MAP_CONFIG.draw_source.removeFeature(feature)
    })

    newFeature = new ol.Feature({
        geometry: new ol.format.GeoJSON().readGeometry(geoJsontoAdd)
    });
    newFeature.setProperties({
        'id': Date.now()
    });
  
    MAP_CONFIG.draw_source.addFeature(newFeature);
}

MAP_CONTROLS.enableControls = function(enable) {
    MAP_CONTROLS.enableButton('.' + MAP_CONTROLS.editButtonId, enable);
    MAP_CONTROLS.enableButton('.' + MAP_CONTROLS.deleteButtonId, enable);
    MAP_CONTROLS.enableButton('.' + MAP_CONTROLS.clearAllButtonId, enable);
    MAP_CONTROLS.enableButton('#continue', enable);
    MAP_CONTROLS.enableButton('.' + MAP_CONTROLS.cutHoleButtonId, enable);
};

MAP_CONTROLS.enableButton = function(selector, enable) {
    $(selector).prop('disabled', !enable);
};

MAP_CONTROLS.removeActiveControl = function() {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    $('.active-control').removeClass('active-control');
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
};
