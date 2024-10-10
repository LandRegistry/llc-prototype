var add_colour = '#003078';// GDS "dark-blue" //'#1d70b8';//'#5a41c6';
var edit_colour = '#00703c';//'#007A7C';
var delete_colour = '#d4351c';//'#c41919';

var add_fill = [0, 48, 120, 0.2 ];// GDS "dark-blue" // [29, 112, 184, 0.2];//[90,65,198,0.1];
var edit_fill = [0, 112, 60, 0.2];//[0,122,124,0.1];
var delete_fill = [212, 53, 28, 0.2];//[196,25,25,0.1];

var fill_none = new ol.style.Fill();
fill_none.setColor([29, 112, 184, 0.1]);

var hatched_fill_add = new ol.style.Fill();
hatched_fill_add.setColor(hatch_pattern(add_colour));
var hatched_fill_edit = new ol.style.Fill();
hatched_fill_edit.setColor(hatch_pattern_2(edit_colour));
var hatched_fill_delete = new ol.style.Fill();
hatched_fill_delete.setColor(hatch_pattern_4(delete_colour));


draw_layer_styles = {
  /*ol, hatch_pattern*/
  // Draw Interactions
  DRAW: 0,
  // Edit Interactions
  EDIT: 1,
  // Remove Interactions
  REMOVE: 2,
  // No Interactions Toggled
  NONE: 3,
  // Hidden
  HIDDEN: 4,
  // Hover
  HOVER: 5,
  // highlight charges
  HIGHLIGHT: 6,
  // Find charges
  SHOW_CHARGE: 7,
  // Fade back other charges when highlighting 
  FADE: 8,
  // Associated Feature Styles for mode
  style: {


    // DRAW | add
    0: new ol.style.Style({
      fill: new ol.style.Fill({
        color: add_fill
      }),
      stroke: new ol.style.Stroke({
        color: add_colour,
        //color: '#85994b',
        width: 3,
        lineDash: [5, 5]
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: add_colour
        })
      })
    }),
    // EDIT
    1: [new ol.style.Style({
      fill: new ol.style.Fill({
        color: edit_fill
      }),
      stroke: new ol.style.Stroke({
        color: edit_colour,
        width: 2,
        /* lineDash: [5, 5] */
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: edit_colour
        })
      })
    }),
    new ol.style.Style({ // second style for the dots on the edge
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: edit_colour
        })
      }),
      geometry: function(feature) { // creating a custom geometry to draw points on
          var coordinates = feature.getGeometry().getCoordinates()[0];
          if (Array.isArray(coordinates)) {
            return new ol.geom.MultiPoint(coordinates);
          }
        }
  })],
    // delete | remove
    2: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: delete_colour,//[255, 0, 0, 0.8],
        width: 2
      }),
      fill: new ol.style.Fill({
        color: delete_fill//[255,0,0,0.4]
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: delete_colour
        })
      })
    }),
    // NONE
    3: new ol.style.Style({
      fill: new ol.style.Fill({
        color: [6, 88, 229, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: '#0658e5',
        width: 2,
       /*  lineDash: [5, 5] */
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: '#0658e5'
        })
      })
    }),
    // HIDDEN
    4: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 255, 0)',
        width: 1
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0)'
      })
    }),
    // HOVER
    5:  new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(0,48,120,0.3)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0,48,120,1)',
              width: 2
            }),
            radius: 5
          }),
    // HIGHLIGHT
    6:  new ol.style.Style({
      fill: new ol.style.Fill({
        //color: 'rgba(0,48,120,0.3)'
        color: [255, 221, 0, 0.6]
      }),
      stroke: new ol.style.Stroke({
        //color: 'rgba(0,48,120,1)',
       // color: '#b1b4b6',
        color: '#003078',
        width: 3
      }),
      radius: 5
    }),
    // SHOW_CHARGE
    7:  new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.25]
      }),
      stroke: new ol.style.Stroke({
        color: '#0658e5',
        width: 2
      }),
      radius: 5
    }),
    // FADE
    8:  new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0]
      }),
      stroke: new ol.style.Stroke({
       // color: '#b1b4b6',
        color: [255, 255, 255, 0],
        width: 1
      }),
      radius: 5
    }),


    // New styles with HATCHING
    
    // DRAW | add (with HATCHING)
    10: new ol.style.Style({
      fill: hatched_fill_add,
      stroke: new ol.style.Stroke({
        color: add_colour,
        /* color: '#85994b', */
        width: 2,
        lineDash: [5, 5]
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: add_colour
        })
      })
    }),
    // EDIT (with HATCHING)
    11: [new ol.style.Style({
      fill: hatched_fill_edit,
      stroke: new ol.style.Stroke({
        color: edit_colour,
        width: 3,
        lineDash: [5, 5]
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: edit_colour
        })
      })
    }),
    new ol.style.Style({ // second style for the dots on the edge
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: edit_colour
          })
        }),
        geometry: function(feature) { // creating a custom geometry to draw points on
            var coordinates = feature.getGeometry().getCoordinates()[0];
            if (Array.isArray(coordinates)) {
              return new ol.geom.MultiPoint(coordinates);
            }
          }
    })],
    // DELETE | remove  (with HATCHING)
    12: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 0, 0, 0.4],
        width: 3,
        lineDash: [5, 5]
      }),
      fill: hatched_fill_delete,
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: delete_colour
        })
      }),
      zIndex: 1
    })
  }
}