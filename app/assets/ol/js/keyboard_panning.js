
  //////////////////////////////////////////////////////////////////////
  // button pixel panning 
  ////////////////////////////////////////////////////////////////////// 
  const step = 10; // pixels
  function moveMap([xDirection, yDirection]) {
    var center = map.getView().getCenter();
    var resolution = map.getView().getResolution();
    map.getView().setCenter([center[0] + xDirection * resolution, center[1] + yDirection * resolution]);
  }


  //////////////////////////////////////////////////////////////////////
  // key pixel panning: Arrows and space bar
  ////////////////////////////////////////////////////////////////////// 
  const step_by_key = 10; // pixels

  function moveMap([xDirection, yDirection]) {
    var center = map.getView().getCenter();
    var resolution = map.getView().getResolution();
    //map.getView().setCenter([center[0] + xDirection * resolution, center[1] + yDirection * resolution]);
    let coords = [center[0] + xDirection * resolution, center[1] + yDirection * resolution];
    let view = map.getView();
    let zoom = view.getZoom();
    view.animate({
            center: coords,
            duration: 100
          });
  }

  document.getElementById('map').addEventListener("keydown", (evt) => {
    console.log(evt.key);
    evt.stopPropagation();
    let view = map.getView();
    let zoom = view.getZoom();
    if(evt.altKey || evt.shiftKey){
      switch (evt.key) {
        case "w":
        case "ArrowUp":
        moveMap([0, step_by_key]);
          break;
        case "ArrowLeft":
        moveMap([-step_by_key, 0]);
          break;
        case "ArrowRight":
        moveMap([step_by_key, 0]);
          break;
        case "ArrowDown":
        moveMap([0, -step_by_key]);
          break;
        case "ArrowDown":
        moveMap([0, -step_by_key]);
          break;
        case "+":
          view.animate({
            zoom: (zoom + 1),
            duration: 300
          });
          break;
        case "_":
          view.animate({
            zoom: (zoom - 1),
            duration: 300
          });
          break;
        default:
          break;
      } 
    } else {

      switch(evt.key) {
        case "w":
        moveMap([0, step_by_key*13]);
          break;
        case "a":
        moveMap([-step_by_key*13, 0]);
          break;
        case "d":
        moveMap([step_by_key*13, 0]);
          break;
        case "s":
        moveMap([0, -step_by_key*13]);
          break;
        case "e":
        case "=":
          view.animate({
            zoom: (zoom + 1),
            duration: 300
          });
          break;
        case "q":
        case "_":
          view.animate({
            zoom: (zoom - 1),
            duration: 300
          });
          break;
          }
      }

    var code = event.charCode || event.keyCode;
    if((code === 32)|| (code === 13)){ // space (32)or Enter (13)
      event.preventDefault();
      var radio = $('[name="edit-mode"]:checked').val();

        if (radio == "draw-area" || radio == "select-area") {
            selectCentre(evt)
        }
        if (radio == "delete-area") {
          console.log('delete');
          deleteCentre(evt);
        }
    }

  });


  function getCenterCoords() {
    center = map.getView().getCenter(map.getSize());
    console.log(center);
    return center;
  }

  function selectCentre(evt){
    // get centre of map
    let center = getCenterCoords();
    // get polygon at those coords
    MASTER_MAP_VECTOR_LAYER.enable();
    MAP_UNDO.store_state();
    var source = MASTER_MAP_VECTOR_LAYER.layer.getSource();
    var features = source.getFeatures();
    var feature = source.getFeaturesAtCoordinate(center)[0];

    if (feature) {
      geometry = feature.getGeometry();
      MAP_CONTROLS.addGeometryToMap(geometry)
    }
    MASTER_MAP_VECTOR_LAYER.disable();

    setMode();
  };

  function deleteCentre(evt){
    // the app creates a drawn layer with the selected polygons, with a timestamp id
    // to remove a polygon, get the feature that contains the centre coords, get it's id and remove it
    console.log('delete');
    // get centre of map
    let center = getCenterCoords();
    // get polygon of the drawn layer at those coords
    var source = MAP_CONFIG.draw_layer.getSource();
    var features = source.getFeatures();
    var feature = source.getFeaturesAtCoordinate(center)[0];

    if (feature) {
      console.log('got feature');
      var feature_id = feature.getProperties().id;
      MAP_CONTROLS.remove_selected_feature(feature_id);
    }

    setMode();
  };