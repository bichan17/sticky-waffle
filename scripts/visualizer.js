app.visualizer = (function() {
/**
 * visualizer.js
 *
 * rgb(a) is used for colors. easier to manipulate programatically
 * sticky-waffle
 */
  //visualizer constructor
  function Visualizer(_canvas, _synth, _settings) {
    var height,
      width,
      top,
      h_middle, // horizontal
      v_middle, // vertical
      bottom,
      left,
      right;
    // objects/settings
    var synth = _synth;
    var canvas = _canvas;
    var ctx = canvas.getContext("2d");
    this.bgColor = _settings.bgColor;
    this.mode = _settings.mode;
    this.color = _settings.color;
    ctx.fillStyle = this.color;

    // visualizer should take up the whole space
    window.onresize = resizeCanvas();
    function resizeCanvas(e) {
      height = canvas.height = window.innerHeight;
      width = canvas.width = window.innerWidth;
      h_middle = Math.round(width/2); // horizontal
      v_middle = Math.round(height/2); // vertical
      bottom = canvas.height;
      right = canvas.width;
    }

    var analyser = synth.getAnalyser();
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);

    this.drawBars = function(){
      var multiplier = 2,
          bar_width = 20,
          barCount,
          magnitude;

      //draw bg
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = this.color;
      analyser.getByteFrequencyData(freqByteData); // this what updates the area with new info
      barCount = Math.round(canvas.width / bar_width);

      for (i = 0; i < barCount; i += 1) {
        magnitude = freqByteData[i];
        // magnitude = Math.round(Math.random()*50+1);
        // some values need adjusting to fit on the this.canvas
        // fillRect(x, y, width, height)

        // drawing origin: middle
        // this.ctx.fillRect(bar_width * i, height/2, bar_width - 1, -magnitude * multiplier);

        // drawing origin: middle
        // bars expand out from middle
        ctx.fillRect(bar_width * i, (canvas.height/2+ Math.round(magnitude/2)), bar_width - 1, -magnitude * multiplier);

        // drawing origin: bottom
        // this.ctx.fillRect(bar_width * i, height, bar_width - 1, -magnitude * multiplier);
      }
    }
  }
  Visualizer.prototype.changeColor = function(_color) {
    color = _color;
  };
  Visualizer.prototype.getColor = function() {
    return this.color;
  };
  Visualizer.prototype.changeBackground = function(_bgColor) {
    this.bgColor = _bgColor;
  };
  Visualizer.prototype.changeMode = function(_mode) {
    this.mode = _mode;
  };
  Visualizer.prototype.update = function() {
    //check mode, call draw function
    this.drawBars();
  };

  return {
    Visualizer : Visualizer
  };
})();
