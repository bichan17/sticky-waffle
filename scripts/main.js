// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	var synth;

	function init (){
		console.log("initialized!");

		// VISUALIZER SETUP
		viz = new app.visualizer.Visualizer(document.getElementById('visualizer'));

		// SYNTH SETUP
		console.log("setup UI");
		var startButton = document.querySelector("#start");
		var stopButton = document.querySelector("#stop");
		var frequencyControl = document.querySelector("#frequencyControl");
		var wavetypeControl = document.querySelector("#wavetypeSelect");
		synth = new app.synth.Synth(startButton, stopButton, frequencyControl, wavetypeControl);
		var fq = synth.getFrequencyVal();
		console.log(fq);
	}
	//Public interface
	return{
		init : init
		//someFunc : someFunc
	}
})();