
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