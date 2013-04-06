app.visualizer = (function() {
  // globals
  var canvas,
      ctx,
      synth,
      mode,
      color,
      bkgd_color,
      analyser;
  var _X = 0,
      _Y = window.innerHeight/2; // center stage

  function Visualizer (_canvas, _synth, _settings) {
    console.log('Visualizer constructor..');
    // the starting position will be the middle of the canvas
    canvas = _canvas;
    ctx = canvas.getContext("2d");
    synth = _synth;
    bkgd_color = _settings.color;
    mode = _settings.mode;
    color = '#b92d19'; // defaults to red
    ctx.fillStyle = color;

    // console.log(synth.getAnalyser());
    analyser = synth.getAnalyser();
    // visualizer should take up the whole space
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    window.onresize = resizeCanvas;
  }

  function resizeCanvas(e) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  function drawBackground() {
    canvas.width = canvas.width;
    ctx.fillStyle = bkgd_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawSprites() {
    // ctx.fillStyle = randomColor();
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(_X, _Y, 20, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
  }


  function randomColor(_alpha){
    var red = Math.round(Math.random()*254+1);
    var green = Math.round(Math.random()*254+1);
    var blue = Math.round(Math.random()*254+1);
    // if an alpha is passed in, use it
    var color = (arguments.length === 1) ? 'rgba('+red+','+green+','+blue+',0.50)' : 'rgb('+red+','+green+','+blue+')';
    return color;
  }







  // every visualizer mode will be a different function
  function drawBars() {
    // console.log('lol');
    // console.log(analyser);
    var multiplier = 2,
      bar_width = 20,
      // freqByteData,
      barCount,
      magnitude,
      width = canvas.width,
      height = canvas.height;

    drawBackground();
    ctx.fillStyle = color;

    freqByteData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqByteData); // this what updates the area with new info
    barCount = Math.round(width / bar_width);

    for (i = 0; i < barCount; i += 1) {
      magnitude = freqByteData[i];
      // magnitude = Math.round(Math.random()*50+1);
      // some values need adjusting to fit on the canvas
      // fillRect(x, y, width, height)

      // drawing origin: middle
      // ctx.fillRect(bar_width * i, height/2, bar_width - 1, -magnitude * multiplier);

      // drawing origin: middle
      // bars expand out from middle
      ctx.fillRect(bar_width * i, (height/2+ Math.round(magnitude/2)), bar_width - 1, -magnitude * multiplier);

      // drawing origin: bottom
      // ctx.fillRect(bar_width * i, height, bar_width - 1, -magnitude * multiplier);
    }
  }

  function drawCircles() {
    // mode three
    // ctx.fillStyle = '#fff';

    byteFreq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(byteFreq);

    var circleRad = 15,
    circleGap = 20,
    barWidth = 10,
    barGap = 4,
    barWidth2 = 10,
    barGap2 = 4,
    triBase = 3,
    triGap = 0,
    // We get the total number of bars to display
    bars = Math.floor(canvas.width / (barWidth + barGap)),
    bars2 = Math.floor(canvas.width / (barWidth2 + barGap2)),
    Tris = Math.floor(canvas.width / (triBase + triGap)),
    Circs = Math.floor(canvas.width / (circleRad + circleGap));
    // function is launched for each frame, together with the byte frequency data.
    // update = function(byteFreq) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // We take an element from the byteFreq array for each of the bars.
      // Let's pretend our byteFreq contains 20 elements, and we have five bars...
    var step = Math.floor(byteFreq.length / bars);
    var step2 = Math.floor(byteFreq.length / bars2);
    var triStep = Math.floor(byteFreq.length / Tris);
    var circstep = Math.floor(byteFreq.length / Circs);
    var BlurCirc = Math.floor(byteFreq.length / 20);
    var MidCirc = Math.floor(byteFreq.length / 4);

    drawBackground();

    for (var i = 0; i < MidCirc; i++) {
      var CircRad = byteFreq[i*MidCirc];
      ctx.fillStyle= randomColor();
      if(i > 0) ctx.fillStyle= randomColor();
      if(i > 1) ctx.fillStyle= randomColor();
      if(i > 2) ctx.fillStyle= randomColor();

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, (CircRad * 2), 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    }
    for (var j = 0; j < BlurCirc; j++) {
      var WCRad = byteFreq[i*BlurCirc] * 1.5;
      ctx.fillStyle= randomColor();

      ctx.globalAlpha = 0.02;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, (WCRad * 2), 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    }
  } // end drawCircles








// ===================================
  Visualizer.prototype.changeBackground = function(_color) {
    color = _color;
  };
  Visualizer.prototype.changeMode = function(_mode) {
    mode = _mode;
  };
  Visualizer.prototype.update = function() {
    // each function takes care of itself?
    // 1. draw bkgd
    // 2. drawSprites();

    if (mode === 'one') {
      drawBars();
    } else if (mode === 'two') {
      // X
      // _X += 4;
      // if (_X > window.innerWidth) _X = 0;
      // Y
      // _Y = (window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50);
    } else if (mode === 'three') {
      drawCircles();
    } else {
      console.log('lol');
    }
  };
// ===================================
  return {
    Visualizer : Visualizer
  };
})();
