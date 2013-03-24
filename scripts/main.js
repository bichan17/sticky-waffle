// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	// GLOBALS
	// synth/oscillator
	var aContext;
	var oscillator;
	var started = false;
	// visualizer/canvas
	var viz,
			ctx;

	function init (){
		console.log("initialized!");


		// VISUALIZER SETUP
		// viz = document.getElementById('visualizer');
		viz = new app.visualizer.Visualizer(document.getElementById('visualizer'));

		// // visualizer should take up the whole space
		// viz.height = window.innerHeight;
		// viz.width = window.innerWidth;
		// window.onresize = resizeCanvas;


		// SYNTH SETUP
		aContext = new webkitAudioContext();
		oscillator = aContext.createOscillator();

		console.log("setup UI");
		var startButton = document.querySelector("#start");
		var stopButton = document.querySelector("#stop");
		var slider = document.querySelector("#slider1");
		var wavetype = document.querySelector("#wavetypeSelect");

		startButton.addEventListener("click", function(){
			started = true;
			startSound(wavetype.value, slider.value);
		});

		stopButton.addEventListener("click", function(){
			started = false;
			stopSound();
		});

		slider.addEventListener("change", function(e){
			//console.log("checked=" + e.target.value);
			document.querySelector("#sliderResults").innerHTML = e.target.value;

			startSound(wavetype.value, e.target.value);
		});

		wavetype.addEventListener("change", function(e){
			//console.log("checked=" + e.target.value);

			startSound(e.target.value, slider.value);
		});

		// drawCircle(20, 20, 4, "blue");
	}

	// function resizeCanvas(e) {
	// 	viz.height = window.innerHeight;
	// 	viz.width = window.innerWidth;
	// }

	function startSound(type, fq){
		console.log("start");
		// oscillator.stop(0);
		if(started == true){
			oscillator.type = type;
			oscillator.frequency.value = fq;
			oscillator.connect(aContext.destination);
			oscillator.start(0);
		}
	}

	function stopSound(){
		console.log("stop");

		oscillator.stop(0);
		oscillator = aContext.createOscillator();
	}

	//Public interface
	return{
		init : init,
		viz : viz
		//someFunc : someFunc
	}
})();