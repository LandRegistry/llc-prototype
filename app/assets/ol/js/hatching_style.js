var hatch_pattern = function (colour) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var pixel_ratio = devicePixelRatio;
    var width = 16 * pixel_ratio;
    var height = 16 * pixel_ratio;
    var offset = width * 0.93;

    canvas.width = width;
    canvas.height = height;
    context.strokeStyle = colour;
    context.lineWidth = 1;

    context.beginPath();
    //draw the diagonal line
    context.moveTo(0, 0);
    context.lineTo(width, height);
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo(width - offset, height);
    context.lineTo(0, offset);
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo(width, height - offset);
    context.lineTo(offset, 0);
    context.stroke()
    return context.createPattern(canvas, 'repeat');
  };

  var hatch_pattern_2 = function (colour) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var pixel_ratio = devicePixelRatio;
    var width = 8 * pixel_ratio;
    var height = 8 * pixel_ratio;
    var offset = width * 0.93;

    canvas.width = width;
    canvas.height = height;
    context.strokeStyle = colour;
    context.lineWidth = 1;

    context.beginPath();
    //draw the diagonal line
    context.moveTo(width, 0);
    context.lineTo(0, height);
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo( offset, height);
    context.lineTo(width, offset);
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo(0, height - offset);
    context.lineTo(width - offset, 0);
    context.stroke()
    return context.createPattern(canvas, 'repeat');
  };

  var hatch_pattern_3 = function (colour) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var pixel_ratio = devicePixelRatio;
    var width = 8 * pixel_ratio;
    var height = 8 * pixel_ratio;
    var offset = width * 0.93;

    canvas.width = width;
    canvas.height = height;
    context.strokeStyle = colour;
    context.lineWidth = 1;

    context.beginPath();
    //draw the diagonal line
    context.moveTo(width/4, height/4);
    context.lineTo(3*width/4, 3* height/4 );
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo(3*width/4, height/4);
    context.lineTo(width/4, 3*height/4);
    //Fill in the top right of the corner so adjacent squares don't look strange
/*     context.moveTo(0, height - offset);
    context.lineTo(width - offset, 0); */
    context.stroke()
    return context.createPattern(canvas, 'repeat');
  };

  var hatch_pattern_4 = function (colour) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var pixel_ratio = devicePixelRatio;
    var width = 8 * pixel_ratio;
    var height = 8 * pixel_ratio;
    var offset = width * 0.93;

    canvas.width = width;
    canvas.height = height;
    context.strokeStyle = colour;
    context.lineWidth = 1;

    context.beginPath();
    //draw the diagonal line
    // horizontal dash
/*     context.moveTo(width/4, height/2);
    context.lineTo(3*width/4, height/2 ); */
    //Fill in the top right of the corner so adjacent squares don't look strange
    context.moveTo(3*width/4, height/4);
    context.lineTo(width/4, 3*height/4);
    //Fill in the top right of the corner so adjacent squares don't look strange
/*     context.moveTo(0, height - offset);
    context.lineTo(width - offset, 0); */
    context.stroke()
    return context.createPattern(canvas, 'repeat');
  };
