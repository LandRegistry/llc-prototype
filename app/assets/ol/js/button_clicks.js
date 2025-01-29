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
    
/*   document.getElementById('fullscreen').onclick = function () {
    window.open("fullscreen", "_self");
  }; */

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
