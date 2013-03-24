// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	var synth;
	function init (){
		console.log("initialized!");
		aContext = new webkitAudioContext();
		oscillator = aContext.createOscillator();

		console.log("setup UI");
		var startButton = document.querySelector("#start");
		var stopButton = document.querySelector("#stop");
		var frequencyControl = document.querySelector("#frequencyControl");
		var wavetypeControl = document.querySelector("#wavetypeSelect");

		synth = new app.synth.Synth(startButton, stopButton, frequencyControl, wavetypeControl);
		

		

		// VISUALIZER SETUP
		var viz = document.getElementById('visualizer'),
				ctx;

		// visualizer should take up the whole space
		viz.height = window.innerHeight;
		viz.width = window.innerWidth;
		window.onresize = resizeCanvas;

		// drawCircle(20, 20, 4, "blue");


		


	}

	function resizeCanvas(e) {
		console.log('lol');
	}


	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();