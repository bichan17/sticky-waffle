app.visualizer = (function() {
  // globals
  var canvas,
      ctx;

  function Visualizer (_canvas, mode) {
    console.log(_canvas);
    canvas = _canvas;

    // visualizer should take up the whole space
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    window.onresize = resizeCanvas;
  }

  return {
    Visualizer : Visualizer
  };

  function resizeCanvas(e) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

// background(0, 0, 0);
// noStroke();

// // position of the middle circle
// var x = 200;
// var y = 200 + 30*sin(x/50);

// var draw = function() {
//     // draw a transparent black square to fill the whole screen
//     // we do this instead of calling the background() function
//     fill(0, 0, 0, 10);
//     rect(0, 0, 400, 400);
    
//     fill(38, 92, 255);
//     ellipse(x % 400, y, 30, 30);
    
//     fill(38, 34, 230);
//     ellipse((x - 150) % 400, y + 20, 30, 30);
   
//     fill(38, 143, 255);
//     ellipse((x - 110) % 400, 400 - y, 30, 30);
    
//     fill(81, 38, 255);
//     ellipse((x + 106) % 400, 360 - y, 30, 30);

//     x += 4;
//     y = 200 + 30*sin(x/50);
// };

// console.log(app.main.viz);

// app.main.viz;


// console.log('lol <-- from: visualizer.js');



})();
