app.visualizer = (function() {
  // globals
  var canvas,
      ctx,
      synth,
      mode,
      color;
  var _X = 0,
      _Y = window.innerHeight/2; // center stage
  var fileReader;

  function Visualizer (_canvas, _synth, _settings) {
    console.log('constructor..');
    // the starting position will be the middle of the canvas
    canvas = _canvas;
    ctx = canvas.getContext("2d");
    synth = _synth;
    color = _settings.color;
    mode = _settings.mode;

    // visualizer should take up the whole space
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    window.onresize = resizeCanvas;

    // console.log(synth);
    console.log(synth.getFrequencyVal());


    /* ---------------------------- */
    fileReader = new FileReader();
    fileReader.onload = function (oFREvent) {
      // document.getElementById("uploadPreview").src = oFREvent.target.result;
      console.log(oFREvent.target.result);
    };

    var path = 'audio/';
    var fileName = 'opening.mp3';
    loadImageFile(path+fileName);

    /* ---------------------------- */
    // the good stuff
    draw();
  }


function loadImageFile(_file) {
  console.log('loadImageFile');
  // if (document.getElementById("uploadImage").files.length === 0) { return; }
  // var oFile = document.getElementById("uploadImage").files[0];
  // if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
  console.log(_file);
  fileReader.readAsDataURL(_file);
  console.log(fileReader.readAsDataURL(_file));
}



  function resizeCanvas(e) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }

  function draw() {
    // var dt = calculateDeltaTime();
    // 1. update sprites
    update();
    // 2. draw bkgd
    drawBackground();
    // 3. everything else
    drawSprites();
    // is the browser ready to draw?
    window.requestAnimFrame(draw);
  }

  function update() {
<<<<<<< HEAD
    // update sprites based on current Mode
    if (mode === 'one') {
      // X
      _X += 4;
      if (_X > window.innerWidth) _X = 0;
      // Y
      _Y = (window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50);
    } else if (mode === 'two') {
      // mode two
      // idle
      _X = window.innerWidth/2;
      // _Y += (window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50);
      // -306 // console.log((window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50));
      // -77 // console.log((synth.getFrequencyVal()/5) * Math.sin(_X/50));
      // -0.77
      // console.log(Math.sin(_X/50));
    } else if (mode === 'three') {
      // mode three
    } else {
      console.log('lol');
    }
=======
    // console.log("x: "+_X);
    // console.log("y: "+_Y);
    _X += 4;
    if (_X > window.innerWidth) _X = 0;
    // _Y = 20 + 30* Math.sin(_X/50);
    // _Y = y-position + amplitude * waveLength 
    _Y = (window.innerHeight/2) + (synth.getFrequencyVal()/5) * Math.sin(_X/50);

    // console.log(synth);
    // console.log("FREQUENCY: "+synth.getFrequencyVal());

    // console.log("x2: "+_X);
    // console.log("y2: "+_Y);
>>>>>>> 26e7c8916905994f3391364a3c3007ed40fc05da
  }

  function drawBackground() {
    canvas.width = canvas.width;
    ctx.fillStyle = color;
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
    var blue=Math.round(Math.random()*254+1);
    // if an alpha is passed in, use it
    var color = (arguments.length === 1) ? 'rgba('+red+','+green+','+blue+',0.50)' : 'rgb('+red+','+green+','+blue+')';
    return color;
  }

  function loadFile(_file) {
    console.log(_file);
    var file = _file;
    var reader = new FileReader();
    console.log(reader);
    reader.onload = function(e) {
      console.log('lol. file loaded');
      console.log(e.target.result);
      analyzeFile(e.target.result);
      // callback(e.target.result);
    };
    // var readFormat = readFormat || "DataUrl";
    // reader['readAsDataUrl'](file);
    console.log('about to load file!');
    // reader.readAsDataURL(file);
  }

  function analyzeFile(_arrayBuffer) {
    // code
    console.log('analyze file');

//   // Create a new `audioContext` and its `analyser`
//   window.audioCtx = new webkitAudioContext()
//   window.analyser = audioCtx.createAnalyser()
//   // If a sound is still playing, stop it.
//   if (window.source)
//     source.noteOff(0)
//   // Decode the data in our array into an audio buffer
//   audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
//     // Use the audio buffer with as our audio source
//     window.source = audioCtx.createBufferSource()   
//     source.buffer = buffer
//     // Connect to the analyser ...
//     source.connect(analyser)
//     // and back to the destination, to play the sound after the analysis.
//     analyser.connect(audioCtx.destination)
//     // Start playing the buffer.
//     source.noteOn(0)
//     // Initialize a visualizer object
//     var viz = new simpleViz()
//     // Finally, initialize the visualizer.
//     new visualizer(viz['update'], analyser)
//     document.getElementById('Info').innerHTML = ''
//   })
  }



// Reusable dropAndLoad function: it reads a local file dropped on a
// `dropElement` in the DOM in the specified `readFormat`
// (In this case, we want an arrayBuffer)
// function dropAndLoad(dropElement, callback, readFormat) {
//   var readFormat = readFormat || "DataUrl"

//   dropElement.addEventListener('dragover', function(e) {
//     e.stopPropagation()
//     e.preventDefault()
//     e.dataTransfer.dropEffect = 'copy'
//   }, false)

//   dropElement.addEventListener('drop', function(e) {
//     e.stopPropagation()
//     e.preventDefault()
//     loadFile(e.dataTransfer.files[0])
//   }, false) 

//   function loadFile(files) {
//     var file = files
//     var reader = new FileReader()
//     reader.onload = function(e) {
//       callback(e.target.result)
//     }
//     reader['readAs'+readFormat](file)
//   }
// }


//   dropAndLoad(element, init, "ArrayBuffer")

// function init(arrayBuffer) {
//   document.getElementById('Info').innerHTML = 'Please Wait'
//   // Create a new `audioContext` and its `analyser`
//   window.audioCtx = new webkitAudioContext()
//   window.analyser = audioCtx.createAnalyser()
//   // If a sound is still playing, stop it.
//   if (window.source)
//     source.noteOff(0)
//   // Decode the data in our array into an audio buffer
//   audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
//     // Use the audio buffer with as our audio source
//     window.source = audioCtx.createBufferSource()   
//     source.buffer = buffer
//     // Connect to the analyser ...
//     source.connect(analyser)
//     // and back to the destination, to play the sound after the analysis.
//     analyser.connect(audioCtx.destination)
//     // Start playing the buffer.
//     source.noteOn(0)
//     // Initialize a visualizer object
//     var viz = new simpleViz()
//     // Finally, initialize the visualizer.
//     new visualizer(viz['update'], analyser)
//     document.getElementById('Info').innerHTML = ''
//   })
// }








// BULLSHIT
//    //var mouse
   //mouse = getMouse(event);
   //function getMouse(event){
  //  var mouse = {}
    //mouse.x = event.pageX - canvas.offsetLeft;
      //mouse.y = event.pageY - canvas.offsetTop;
      //return mouse;
  //}
//    window.onload = function() {
//   var element = document.getElementById('container')
//   dropAndLoad(element, init, "ArrayBuffer")
// }


// Reusable dropAndLoad function: it reads a local file dropped on a
// `dropElement` in the DOM in the specified `readFormat`
// (In this case, we want an arrayBuffer)
// function dropAndLoad(dropElement, callback, readFormat) {
//   var readFormat = readFormat || "DataUrl"

//   dropElement.addEventListener('dragover', function(e) {
//     e.stopPropagation()
//     e.preventDefault()
//     e.dataTransfer.dropEffect = 'copy'
//   }, false)

//   dropElement.addEventListener('drop', function(e) {
//     e.stopPropagation()
//     e.preventDefault()
//     loadFile(e.dataTransfer.files[0])
//   }, false) 

//   function loadFile(files) {
//     var file = files
//     var reader = new FileReader()
//     reader.onload = function(e) {
//       callback(e.target.result)
//     }
//     reader['readAs'+readFormat](file)
//   }
// }

// Once the file is loaded, we start getting our hands dirty.
        // function init(arrayBuffer) {
        //   document.getElementById('Info').innerHTML = 'Please Wait'
        //   // Create a new `audioContext` and its `analyser`
        //   window.audioCtx = new webkitAudioContext()
        //   window.analyser = audioCtx.createAnalyser()
        //   // If a sound is still playing, stop it.
        //   if (window.source)
        //     source.noteOff(0)
        //   // Decode the data in our array into an audio buffer
        //   audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
        //     // Use the audio buffer with as our audio source
        //     window.source = audioCtx.createBufferSource()   
        //     source.buffer = buffer
        //     // Connect to the analyser ...
        //     source.connect(analyser)
        //     // and back to the destination, to play the sound after the analysis.
        //     analyser.connect(audioCtx.destination)
        //     // Start playing the buffer.
        //     source.noteOn(0)
        //     // Initialize a visualizer object
        //     var viz = new simpleViz()
        //     // Finally, initialize the visualizer.
        //     new visualizer(viz['update'], analyser)
        //     document.getElementById('Info').innerHTML = ''
        //   })
        // }

// The visualizer object. 
// Calls the `visualization` function every time a new frame
// is available.
// Is passed an `analyser` (audioContext analyser).
        // function visualizer(visualization, analyser) {
        //   var self = this
        //   this.visualization = visualization  
        //   var last = Date.now()
        //   var loop = function() {
        //     var dt = Date.now() - last
        //     // we get the current byteFreq data from our analyser
        //     var byteFreq = new Uint8Array(analyser.frequencyBinCount)
        //     analyser.getByteFrequencyData(byteFreq)
        //     last = Date.now()
        //     // We might want to use a delta time (`dt`) too for our visualization.
        //     self.visualization(byteFreq, dt)
        //     webkitRequestAnimationFrame(loop)
        //   }
        //   webkitRequestAnimationFrame(loop)
        // }

// A simple visualization. Its update function illustrates how to use 
// the byte frequency data from an audioContext analyser.
        // function simpleViz(canvas) {
        //   var self = this
        //   this.canvas = document.getElementById('canvas')
        //   this.ctx = this.canvas.getContext("2d")
        //   this.copyCtx = document.getElementById('canvas-copy').getContext("2d")
        //   this.ctx.fillStyle = '#fff' 
        //   this.circleRad = 15
        //   this.circleGap = 20
        //   this.barWidth = 10
        //   this.barGap = 4
        //   this.barWidth2 = 10
        //   this.barGap2 = 4
        //   this.triBase = 3
        //   this.triGap = 0
        //   // We get the total number of bars to display
        //   this.bars = Math.floor(this.canvas.width / (this.barWidth + this.barGap))
        //   this.bars2 = Math.floor(this.canvas.width / (this.barWidth2 + this.barGap2))
        //   this.Tris = Math.floor(this.canvas.width / (this.triBase + this.triGap))
        //   this.Circs = Math.floor(this.canvas.width / (this.circleRad + this.circleGap))
        //   // This function is launched for each frame, together with the byte frequency data.
        //   this.update = function(byteFreq) {
        //     self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
        //     // We take an element from the byteFreq array for each of the bars.
        //     // Let's pretend our byteFreq contains 20 elements, and we have five bars...
        //     var step = Math.floor(byteFreq.length / self.bars)
        //   var step2 = Math.floor(byteFreq.length / self.bars2)
        //   var triStep = Math.floor(byteFreq.length / self.Tris)
        //   var circstep = Math.floor(byteFreq.length / self.Circs)
    // `||||||||||||||||||||` elements
    // `|   |   |   |   |   ` elements we'll use for our bars
    /*for (var i = 0; i < self.bars; i ++) {
      // Draw each bar
      var barHeight = byteFreq[i*step]
   self.ctx.fillStyle="#000000";
   if(i > 10){
   self.ctx.fillStyle="#FF0000";
   }
   if(i > 20){
   self.ctx.fillStyle="#FFFF00";
   }
   
      self.ctx.fillRect(
        i * (self.barWidth + self.barGap), 
        self.canvas.height - barHeight, 
        self.barWidth, 
        barHeight)
    
      self.copyCtx.clearRect(0, 0, self.canvas.width, self.canvas.height)
      self.copyCtx.drawImage(self.canvas, 0, 0)
    }
  for (var t = 0; t < self.bars2; t ++) {
      // Draw each bar
      var barHeight2 = (byteFreq[t*step2]/2)
   self.ctx.fillStyle="#FFFF00";
   if(t > 10){
   self.ctx.fillStyle="#0000FF";
   }
   if(t > 20){
   self.ctx.fillStyle="#000000";
   }
   
      self.ctx.fillRect(
        t * (self.barWidth2 + self.barGap2), 
        self.canvas.height - barHeight2, 
        self.barWidth2, 
        barHeight2)
    
      self.copyCtx.clearRect(0, 0, self.canvas.width, self.canvas.height)
      self.copyCtx.drawImage(self.canvas, 0, 0)
    }*/
  /*for (var i = 0; i < self.Tris/2; i ++) {
    var triHeight = byteFreq[i*triStep] * 1.5
    self.ctx.fillStyle= getRandomColor();
    if(i > 6){
    //self.ctx.fillStyle= getRandomColor();
    }
    if(i > 12){
    //self.ctx.fillStyle= getRandomColor();
    }
    if(i > 18){
    //self.ctx.fillStyle=  getRandomColor();
    }
    if(i > 24){
    //self.ctx.fillStyle= getRandomColor();
    }
    if(i > 30){
    //self.ctx.fillStyle= getRandomColor();
    }
    
    self.ctx.globalAlpha = 0.01;
    self.ctx.beginPath();
    self.ctx.arc(self.canvas.width/2, self.canvas.height/2, (triHeight * 1.5), 0, 2 * Math.PI, false);
    self.ctx.fill();
    self.ctx.closePath();
    
    }
  for (var i = 0; i < self.Tris/3; i ++) {
    var triHeight = byteFreq[i*triStep] * 1.5
    self.ctx.fillStyle= "#FFFFFF";
    
    self.ctx.globalAlpha = 0.004;
    self.ctx.beginPath();
    self.ctx.arc(self.canvas.width/2, self.canvas.height/2, (triHeight * 2), 0, 2 * Math.PI, false);
    self.ctx.fill();
    self.ctx.closePath();
    
    }
  */
          // for (var i = 0; i < self.Tris; i ++) {
          //   var triHeight = byteFreq[i*triStep] * 1.5
    /*self.ctx.beginPath();
    self.ctx.moveTo(0, i * (self.triBase + self.triGap))
    self.ctx.lineTo(triHeight, i * (self.triBase + self.triGap) + (self.triBase/2))
    self.ctx.lineTo(0, i * (self.triBase + self.triGap) + (self.triBase))
    self.ctx.lineTo(0, i * (self.triBase + self.triGap))
    
    self.ctx.fill();
    self.ctx.closePath();
    */
            // self.ctx.fillStyle= getRandomColor();;
            // if(i > self.Tris/3){
            // //self.ctx.fillStyle="#00FF00";
            // }
            // if(i > self.Tris * (2/3)){
            // //self.ctx.fillStyle="#FF0000";
            // }
            // 
            // self.ctx.beginPath();
            // self.ctx.moveTo(i * (self.triBase + self.triGap),self.canvas.height)
            // self.ctx.lineTo(i * (self.triBase + self.triGap) + (self.triBase/2),self.canvas.height - triHeight + 2)
            // self.ctx.lineTo(i * (self.triBase + self.triGap) + (self.triBase), self.canvas.height)
            // self.ctx.lineTo(i * (self.triBase + self.triGap), self.canvas.height)

            // self.ctx.fill();
            // self.ctx.closePath();

    //self.copyCtx.clearRect(0, 0, self.canvas.width, self.canvas.height)
    //self.copyCtx.drawImage(self.canvas, 0, 0)
            // }

          // }

        // }


























































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




// ===================================
  Visualizer.prototype.changeBackground = function(_color) {
    color = _color;
  };
  Visualizer.prototype.changeMode = function(_mode) {
    mode = _mode;
    console.log('changeMode: '+mode);
  };

  // ===================================
  return {
    Visualizer : Visualizer
  };
})();
