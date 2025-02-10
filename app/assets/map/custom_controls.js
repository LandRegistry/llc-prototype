function setMode(){
  var radio = $('[name="edit-mode"]:checked').val();
  map.removeInteraction(MAP_CONTROLS.hover_interaction);
  console.log(radio);
  //hide cross hair
  $('.center').addClass('govuk-visually-hidden');

  if (radio == "cutout-area" ) {
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
       /*  $("#" + MAP_CONTROLS.cutHoleButtonId).trigger("edit:toggled"); */
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
  }

  if (radio == "draw-area") {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MASTER_MAP_VECTOR_LAYER.enable()
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

    MAP_CONTROLS.add_draw_interaction("Polygon", $('#' + MAP_CONTROLS.addAreaButtonId));
  }

  if (radio == "add-circle") {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MASTER_MAP_VECTOR_LAYER.enable()
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

    MAP_CONTROLS.add_draw_interaction("Circle", $('#' + MAP_CONTROLS.addAreaButtonId));
  }
  if (radio == "add-point") {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MASTER_MAP_VECTOR_LAYER.enable()
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

    MAP_CONTROLS.add_draw_interaction("Point", $('#' + MAP_CONTROLS.addAreaButtonId));
  }
  if (radio == "add-line") {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MASTER_MAP_VECTOR_LAYER.enable()
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

    MAP_CONTROLS.add_draw_interaction("LineString", $('#' + MAP_CONTROLS.addAreaButtonId));
  }

  if (radio == "select-area") {
    $('.center').removeClass('govuk-visually-hidden');
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MASTER_MAP_VECTOR_LAYER.enable()
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW);

    MAP_CONTROLS.current_interaction = new ol.interaction.Select({
      layers: [MASTER_MAP_VECTOR_LAYER.layer],
      style: draw_layer_styles.style[draw_layer_styles.DRAW]
    });

    // ADD hover functionality
    MAP_CONTROLS.hover_interaction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
      style: draw_layer_styles.style[draw_layer_styles.HOVER]
    });
    map.addInteraction(MAP_CONTROLS.hover_interaction);

    MAP_CONTROLS.current_interaction.getFeatures().on('add', function (event) {
      MAP_UNDO.store_state();
      feature = event.target.item(0).clone();
      if (feature) {
        geometry = feature.getGeometry();
        //Convert multi polygons to features
        if (geometry instanceof ol.geom.MultiPolygon) {
          geometry.getPolygons().forEach(function (geometry) {
            MAP_CONTROLS.addGeometryToMap(geometry)
          })
        }
        else {
          MAP_CONTROLS.addGeometryToMap(geometry)
        }
      }
    });

    MAP_CONTROLS.vectorControls.copy_enabled = true;
    map.addInteraction(MAP_CONTROLS.current_interaction);
  }

  if (radio == "edit-area") {
    map.removeInteraction(MAP_CONTROLS.current_interaction);

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

      MAP_CONTROLS.current_interaction.on('modifystart', function (event) {
        MAP_UNDO.store_state();
      });

  }


  if (radio == "delete-area") {
    $('.center').removeClass('govuk-visually-hidden');
    map.removeInteraction(MAP_CONTROLS.current_interaction);

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

  }

};


// Not sure about this - vector snap also depends on zoom level
  // this is because we can only load in a set number of polygons to use for the 'snap'
  let userSetSnapToMap = true;
  $('#snap_to_map').change(function () {
    MAP_CONTROLS.vectorControls.snap_to_enabled = $(this).is(':checked');
    userSetSnapToMap = $(this).is(':checked');
   
    if (MAP_CONTROLS.vectorControls.snap_to_enabled) {
      // Enable the snap to interaction and vector layer
      SNAP_TO_VECTOR_LAYER.enable();
      map.addInteraction(snap_to_interaction);
      MAP_CONTROLS.vectorControls.snap_to_enabled = true;
    } else {
      // Disable the snap to interaction and vector layer, but not the snap to button
      // Don't disable vector layer if copy active
      if (!MAP_CONTROLS.vectorControls.copy_enabled) {
        SNAP_TO_VECTOR_LAYER.disable();
      }
      map.removeInteraction(snap_to_interaction);
      MAP_CONTROLS.vectorControls.snap_to_enabled = false;
    }
  });  
  
  
  document.getElementById('zoom-out').onclick = function () {
    console.log('click OUT');
    checkZoom();
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: (zoom - 1),
      duration: 300
    });
  };
    
  document.getElementById('zoom-in').onclick = function () {
    console.log('click IN');
    checkZoom();
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: (zoom + 1),
      duration: 300
    });
  };
    
  /*   
  document.getElementById('fullscreen').onclick = function () {
    window.open("fullscreen", "_self");
  };
  */

  document.getElementById('clearAllBtn').onclick = function () {
    map.removeInteraction(MAP_CONTROLS.current_interaction);
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
    MAP_CONFIG.draw_source.clear();
    setMode();
  };

  document.getElementById('undoBtn').onclick = function () {
    MAP_UNDO.undo();
    setMode();
  };

  $(document).on("change", "input[type=radio]", function () {
    setMode();
  });



  function checkZoom() {
    const view = map.getView();
    const zoom = view.getZoom();

    if (zoom < 12 && zoom > 0) { //stops the check disabling select-area at start
      $("#select").prop('disabled', 'true');
      // if select was checked, uncheck it and set as draw
      if ($("#select").prop('checked') == true) {
        $("#draw").prop('checked', 'true');
      }
      // disable snap to map when zoomed out
      $("#snap_to_map").prop('disabled', 'true');
      $("#snap_to_map").prop('checked', false)
    } else {     
      $("#select").removeAttr("disabled");
      // enable snap to map when zoomed out
      $("#snap_to_map").removeAttr("disabled");

      $("#snap_to_map").prop('checked', userSetSnapToMap)
    }

    //reset the controls
    setMode();
  }
