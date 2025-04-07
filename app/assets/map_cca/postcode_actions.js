  ///////////////////////////////////////////////
  // postcode / address check
  ///////////////////////////////////////////////
  $("#find-btn").click(function(e){
    $('#address-list').show();
    $('#selected-address').hide();
    $('#results-heading').show();
    $("#postcodes").css("height", 400);   
  });  
  
  $("li a").click(function(e){
    console.log(this.text);
    $('#address-list').hide();
    $("#postcodes").css("height", 240); 
    $('#selected-address').html("This is the map for:<br/>" + this.text);
    $('#selected-address').show();
    $('#results-heading').hide();
    $('#results-guide').show();

    const view = map.getView();
    const zoom = view.getZoom();

    let coords =[532050, 181750];
      view.animate({
        center: coords,
        zoom: (zoom + 3),
        duration: 0
      }); 

    MAP_CONTROLS.vectorControls.snap_to_enabled = $('#snap_to_map').is(':checked');
    SNAP_TO_VECTOR_LAYER.enable();
    map.addInteraction(snap_to_interaction);
  });