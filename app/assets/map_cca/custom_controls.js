
  
  
  document.getElementById('zoom-out').onclick = function () {
    console.log('click OUT');
    //checkZoom();
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: (zoom - 1),
      duration: 300
    });
  };
    
  document.getElementById('zoom-in').onclick = function () {
    console.log('click IN');
    //checkZoom();
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({
      zoom: (zoom + 1),
      duration: 300
    });
  };
    

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

  }
