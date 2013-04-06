// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	var synth;
	var viz;
	var viz_settings; // the "visualizer" object (holds settings)
	var body;

	function init (){
		console.log("initialized!");
		// console.log(app.synth.Synth);
		body = document.getElementsByTagName('body')[0];

		// SYNTH SETUP
		console.log("setup UI");
		var startButton = document.querySelector("#start");
		var stopButton = document.querySelector("#stop");
		var frequencyControl = document.querySelector("#frequencyControl");
		var wavetypeControl = document.querySelector("#wavetypeSelect");


		synth = new app.synth.Synth(startButton, stopButton, frequencyControl, wavetypeControl);

		// VISUALIZER SETUP
		// ----------------------------
		viz_settings = {}; // 1. create the viz_settings object
		// 2. set up UI
		var colorButtons = document.getElementById('bkgd').getElementsByTagName('input');
		for (var i = 0; i < colorButtons.length; i++) {
			colorButtons[i].addEventListener("change", changeColor, false);
			// get the default checked value
			if (colorButtons[i].checked){viz_settings.color = colorButtons[i].value;}
		}
		// add event listeners to Mode buttons
		var modeButtons = document.getElementById('mode').getElementsByTagName('input');
		for (var j = 0; j < modeButtons.length; j++) {
			modeButtons[j].addEventListener("change", changeVizMode, false);
			// get the default checked value
			if (modeButtons[j].checked){viz_settings.mode = modeButtons[j].value;}
		}
		// create Visualizer | pass in: DOM <canvas> reference, synth object, settings
		viz = new app.visualizer.Visualizer(document.getElementById('visualizer'), synth, viz_settings);
		// finish UI set up
		// ----------------------------
		body.className += 'black';

		// var element = document.getElementById('container');

		loop();
	}

	function loop(){
		var dt = calculateDeltaTime();

		
		update(dt);

		//tell the browser to let us know when its ready to animate
		//which is usually in 1/60th of a second
		//animate is the function that will be called back

		window.requestAnimFrame(loop);
		
	}

	function update(dt){
		synth.update();
		// console.log(synth);
		// console.log(viz);
		viz.update();


	}

	function changeColor(e) {
		// change <canvas> colors
		viz_settings.color = e.target.value;
		viz.changeBackground(viz_settings.color);

		// change DOM colors
		body.className = ''; // clear classNames
		if (viz_settings.color === '#000') body.className += 'black';
		else if (viz_settings.color === '#fff') body.className += 'white';
	}

	function changeVizMode(e) {
		viz_settings.mode = e.target.value;
		viz.changeMode(viz_settings.mode);
	}

// ===================================


// Reusable dropAndLoad function: it reads a local file dropped on a
// `dropElement` in the DOM in the specified `readFormat`
// (In this case, we want an arrayBuffer)
function dropAndLoad(dropElement, _readFormat) {
  var readFormat = _readFormat || "DataUrl";

  dropElement.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, false);

  dropElement.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    // loadFile(e.dataTransfer.files[0]);
    console.log('should only happen once');
    // console.log(loadFile(e.dataTransfer.files[0]));
    console.log(viz);
    loadFile(e.dataTransfer.files[0]);
  }, false) ;

  function loadFile(files) {
    var file = files;
    // console.log(file);
    var reader = new FileReader();
    // console.log(reader);
    var result;
    reader.onload = function(e) {
			// console.log('lol');
			// console.log(e.target.result);
			// result = e.target.result;
			// console.log('result:');
			// console.log(result);
			// return e.target.result;
			viz.doStuff(e.target.result);
			// console.log(callback);
      // callback(e.target.result);
    };

    // console.log(result);

    // do we need this line? yes
    // we return the ArrayBuffer
    return reader['readAs'+readFormat](file);
  }


  // console.log('god i hope this works');
  // console.log(loadFile);
}



	//Public interface
	return{
		init : init
		//someFunc : someFunc
	};
})();