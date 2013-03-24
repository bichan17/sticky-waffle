app.visualizer = (function() {
  // globals
  var canvas,
      ctx;
      // _X,
      // _Y;
  var _X = 0,
      _Y = window.innerHeight/2;

  function Visualizer (_canvas, mode) {
    console.log(_canvas);
    canvas = _canvas;
    ctx = canvas.getContext("2d");

    // visualizer should take up the whole space
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    window.onresize = resizeCanvas;

    // the starting position will be the middle of the canvas
    // ctx.translate();

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||  
              window.mozRequestAnimationFrame    ||  
              window.oRequestAnimationFrame      ||  
              window.msRequestAnimationFrame     ||  
              function( callback ){ 
                window.setTimeout(callback, 1000 / 60); 
              };
    })();

    // the good stuff
    draw();
  }

  return {
    Visualizer : Visualizer
  };

  function resizeCanvas(e) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  function draw() {

    // var dt = calculateDeltaTime();
    // if(!paused) {
      // 1. update sprites
      update();
      // 2. draw bkgd
      drawBackground();
      // 3. everything else
      drawSprites();
    // }
    // is the browser ready to draw?
    window.requestAnimFrame(draw);


    //  ctx.arc(_x, _y, _radius,startAngle,endAngle, clockwise)
    // var _X = window.innerWidth/2,
    //     _Y = window.innerHeight/2;
    // console.log('lol');
    // ctx.fillStyle = "#f00";
    // ctx.beginPath();
    // ctx.arc(_X, _Y, 20, 0, Math.PI*2, false);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
  }

  function update() {
    // console.log("x: "+_X);
    // console.log("y: "+_Y);
    _X += 4;
    if (_X > window.innerWidth) _X = 0;
    // _Y = 20 + 30* Math.sin(_X/50);
    // _Y = y-position + amplitude * waveLength 
    _Y = (window.innerHeight/2) + 300 * Math.sin(_X/50);

    // console.log("x2: "+_X);
    // console.log("y2: "+_Y);
  }
  function drawBackground() {
    // console.log("2");
    canvas.width = canvas.width;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);  
  }
  function drawSprites() {
    // console.log("3");
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.arc(_X, _Y, 20, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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



})();