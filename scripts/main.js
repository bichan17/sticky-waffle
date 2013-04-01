// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	var synth;
	var viz;
	var viz_settings; // the "visualizer" object (holds settings)
	var body;

	function init (){
		console.log("initialized!");
		body = document.getElementsByTagName('body')[0];

		// SYNTH SETUP
		console.log("setup UI");
		var startButton = document.querySelector("#start");
		var stopButton = document.querySelector("#stop");
		var frequencyControl = document.querySelector("#frequencyControl");
		var wavetypeControl = document.querySelector("#wavetypeSelect");
		synth = new app.synth.Synth(startButton, stopButton, frequencyControl, wavetypeControl);

		console.log(synth);

		// VISUALIZER SETUP
		// ----------------------------
		// 1. create the viz_settings object
		viz_settings = {};
		// 2. every change updates the viz_settings objects
		// add event listeners to Color buttons
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


	//Public interface
	return{
		init : init
		//someFunc : someFunc
	};
})();