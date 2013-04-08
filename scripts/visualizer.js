app.visualizer = (function() {
/**
 * visualizer.js
 *
 * rgb(a) is used for colors. easier to manipulate programatically
 * sticky-waffle
 */
  // globals
  // --
  // objects/settings
  var canvas,
      ctx,
      synth, //sound object
      mode,
      analyser,
      freqByteData;
  // color vars
  var color  = 'rgb(185,45,25)', // defaults to red,
      colorCodes,
      colorIndex,
      r, g, b, a,
      bkgd_color = 'rgba(0,0,0)',
      transition; // boolean
  // "attributes"
  var height,
      width,
      top,
      h_middle, // horizontal
      v_middle, // vertical
      bottom,
      left,
      right;

  function Visualizer (_canvas, _synth, _settings) {
    // objects/settings
    canvas = _canvas;
    ctx = canvas.getContext("2d");
    synth = _synth;
    bkgd_color = _settings.bkgd_color;
    mode = _settings.mode;

    // color settings
    color = _settings.color;
    colors = color.split(')')[0].split('(')[1].split(',');
    colorCodes = [];
    colorIndex = 0;
    r = colors[0]; colorCodes.push(r);
    g = colors[1]; colorCodes.push(g);
    b = colors[2]; colorCodes.push(b);
    a = 1; colorCodes.push(a);
    ctx.fillStyle = color;
    transition = false;

    // visualizer should take up the whole space
    window.onresize = resizeCanvas;
    height = canvas.height = window.innerHeight;
    width = canvas.width = window.innerWidth;
    top = 0;
    bottom = height;
    h_middle = Math.round(width/2); // horizontal
    v_middle = Math.round(height/2); // vertical
    right = width;
    left = 0;

    analyser = synth.getAnalyser();
    freqByteData = new Uint8Array(analyser.frequencyBinCount);
    // analyser.getByteFrequencyData(freqByteData); // this what updates the area with new info
  }

  function resizeCanvas(e) {
    height = canvas.height = window.innerHeight;
    width = canvas.width = window.innerWidth;
    h_middle = Math.round(width/2); // horizontal
    v_middle = Math.round(height/2); // vertical
    bottom = canvas.height;
    right = canvas.width;
  }

  function drawBackground() {
    ctx.fillStyle = bkgd_color;
    ctx.fillRect(0, 0, width, height);
  }

  function randomColor(_alpha){
    var red = Math.round(Math.random()*254+1);
    var green = Math.round(Math.random()*254+1);
    var blue = Math.round(Math.random()*254+1);
    // if an alpha is passed in, use it
    var newColor = (arguments.length === 1) ? 'rgba('+red+','+green+','+blue+',0.50)' : 'rgb('+red+','+green+','+blue+')';
    return newColor;
  }

  function transitionColor(_alpha) {
    // increments its way up the color scale
    // - starts at the current color

    // increment the value
    var val = parseInt(colorCodes[colorIndex], 10);
    val++;

    // when it reaches 255
    // switch to the next index
    if (val >= 255) {
      val = 255;
      console.log('time to switch');
      colorIndex++;
    //   else {
      // colorIndex++;
      // if (colorIndex > 2) colorIndex = 0;

    //     console.log(colorIndex);
    }
    // } else {
    // }
    // console.log(val);
    //   // when all are 255
    //   // start going in reverse --

    // for (var i = 0; i < colorCodes.length - 1; i++) {
    // }
    colorCodes[colorIndex] = String(val);
    // a = _alpha;
    // console.log('rgba('+colorCodes.join()+')');
    console.log(val+' | '+colorIndex);
    return 'rgba('+colorCodes.join()+')';
  }




  // every visualizer mode will be a different function
  function drawBars() {
    var multiplier = 2,
        bar_width = 20,
        barCount,
        magnitude;

    drawBackground();
    ctx.fillStyle = color;

    analyser.getByteFrequencyData(freqByteData); // this what updates the area with new info
    barCount = Math.round(canvas.width / bar_width);

    for (i = 0; i < barCount; i += 1) {
      magnitude = freqByteData[i];
      // magnitude = Math.round(Math.random()*50+1);
      // some values need adjusting to fit on the canvas
      // fillRect(x, y, width, height)

      // drawing origin: middle
      // ctx.fillRect(bar_width * i, height/2, bar_width - 1, -magnitude * multiplier);

      // drawing origin: middle
      // bars expand out from middle
      ctx.fillRect(bar_width * i, (canvas.height/2+ Math.round(magnitude/2)), bar_width - 1, -magnitude * multiplier);

      // drawing origin: bottom
      // ctx.fillRect(bar_width * i, height, bar_width - 1, -magnitude * multiplier);
    }
  }

  function drawCircles() {
    var circleRad = 15,
        circleGap = 20,
        Circs = Math.floor(canvas.width / (circleRad + circleGap));
    var circstep = Math.floor(freqByteData.length / Circs);
    var BlurCirc = Math.floor(freqByteData.length / 20);
    var MidCirc = Math.floor(freqByteData.length / 4);

    drawBackground();
    ctx.fillStyle = color;

    analyser.getByteFrequencyData(freqByteData);

    for (var i = 0; i < MidCirc; i++) {
      var CircRad = freqByteData[i*MidCirc];

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, (CircRad * 2), 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    }
  } // end drawCircles




  function makeParticles() {
    var particles = [];
    var emmit_radius = 50,
        particleLimit = 10,
        fill;

    analyser.getByteFrequencyData(freqByteData);

    for (var i = 0; i < particleLimit; i++) {
      // emmit from 20px radius of center
      var px = Math.round(Math.random()*emmit_radius)+h_middle,
          py = Math.round(Math.random()*emmit_radius)+v_middle,
          pr = freqByteData[i];

      fill = ctx.createRadialGradient(px, py, 0, px, py, pr);
      // fill.addColorStop(0, "white");
      fill.addColorStop(Math.random()*0.1 +0.3, "white");
      fill.addColorStop(0.4, color);
      fill.addColorStop(1, bkgd_color);

      particles.push(
        app.particle.createParticle(
          ctx,
          {
            x: px,
            y: py,
            base_radius: pr
          },
          fill
        ) //end makeParticle()
      ); //end partice push
    }

    drawBackground();

    // draw particles
    particles.forEach(function(p){
      p.update();
      p.draw(ctx);
    });
  }


  function particles2() {
    // code
    console.log('particles2');

    // var particles = [];
    // var emmit_radius = 10,
    //     particleLimit = 10,
    //     fill;

    // analyser.getByteFrequencyData(freqByteData);

    // for (var i = 0; i < particleLimit; i++) {
    //   // emmit from 20px radius of center
    //   var px = Math.round(Math.random()*emmit_radius)+h_middle,
    //       py = Math.round(Math.random()*emmit_radius)+v_middle,
    //       pr = freqByteData[i]/2;

    //   fill = ctx.createRadialGradient(px, py, 0, px, py, pr);
    //   fill.addColorStop(0, "white");
    //   fill.addColorStop(Math.random()*0.1 +0.3, "white");
    //   fill.addColorStop(0.4, color);
    //   fill.addColorStop(1, "black");

    //   particles.push(
    //     app.particle.createParticle(
    //       ctx,
    //       {
    //         x: px,
    //         y: py,
    //         base_radius: pr
    //       },
    //       color
    //     ) //end makeParticle()
    //   ); //end partice push
    // }

    // drawBackground();

    // // draw particles
    // // ctx.globalCompositeOperation = "lighter";
    // particles.forEach(function(p){
    //   p.update();
    //   p.draw(ctx);
    // });
  }


      // _Y = (window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50);










// ===================================
  Visualizer.prototype.changeColor = function(_color) {
    transition = false;

    if (_color === 'transition') {
      transition = true;
    } else if (_color === 'random') {
      color = randomColor();
    } else {
      color = _color;
    }

    // update color info
    colors = color.split(')')[0].split('(')[1].split(',');
    colorCodes[0] = colors[0];
    colorCodes[1] = colors[1];
    colorCodes[2] = colors[2];
    colorCodes[3] = 1;
    // console.log('updated color info:');
    // console.log(colorCodes.join());
  };
  Visualizer.prototype.changeBackground = function(_bkgd_color) {
    bkgd_color = _bkgd_color;
  };
  Visualizer.prototype.changeMode = function(_mode) {
    mode = _mode;
  };
  Visualizer.prototype.update = function() {
    if (transition) color = transitionColor();

    if (mode === 'one') drawBars();
    else if (mode === 'two') makeParticles();
    else if (mode === 'three') drawCircles();
    else if (mode === 'four') particles2();
    else console.log('lol');
  };
// ===================================
  return {
    Visualizer : Visualizer
  };
})();
