app.main = (function(){
	// global vars
	var synth;
	var viz;
	var viz_settings; // the "visualizer" object (holds settings)
	var body;
  var ss = document.styleSheets[0];
  var rules = ss.cssRules || ss.rules;
  var played_CSS = null;

	function init (){
		console.log("initialized!");
		body = document.getElementsByTagName('body')[0];
		body.className += 'black';

		// SYNTH SETUP
		// ----------------------------
		var wavetypeControl = document.querySelector("#wavetypeSelect");
		var delayControl = document.querySelector("#delay");
		var feedbackControl = document.querySelector("#feedback");

		synth = new app.synth.Synth(wavetypeControl, delayControl, feedbackControl);

		console.log(synth);


		// VISUALIZER SETUP
		// ----------------------------
		viz_settings = {color: "rgb(185,45,25)", bgColor: "rgb(0,0,0)", mode: "one"};  // 1. create the viz_settings object


		// console.log(viz_settings);

		// create Visualizer | pass in: DOM <canvas> reference, synth object, settings
		viz = new app.visualizer.Visualizer(document.getElementById('visualizer'), synth, viz_settings);

		console.log(viz);


		// this was found on stackoverflow
		// it gives us a referenece to the CSS style rule we will constantly change
    for (var l = 0; l < rules.length; l++) {
      var rule = rules[l]; //local var
      // regex test to find correct rule
      if (/played/i.test(rule.selectorText)) {
        played_CSS = rule;
        break; // not sure if this break is necessary
      }
    }

		// start update loop
		loop();
	}

	function loop(){
		// do stuff
		update();

		//tell the browser to let us know when its ready to animate
		//which is usually in 1/60th of a second
		//animate is the function that will be called back

		window.requestAnimFrame(loop);
	}

	function update(){
		// the synth and viz objects have their own update functions
		synth.update();
		viz.update();
		// change the CSS rule color to match current viz color
		played_CSS.style.color = viz.getColor();
	}

	function changeColor(e) {
		// change <canvas> colors

		//change to:
		// viz_settings.color = myColor;
		
		viz_settings.color = e.target.value;
		viz.changeColor(viz_settings.color);
	}

	function changeBackgroundColor(e) {
		// change <canvas> colors
		viz_settings.bgColor = e.target.value;
		viz.changeBackground(viz_settings.bgColor);

		// change DOM colors and classNames
		body.className = ''; // clear classNames
		if (viz_settings.bgColor === 'rgb(0,0,0)') body.className += 'black';
		else if (viz_settings.bgColor === 'rgb(255,255,255)') body.className += 'white';
		else body.className += 'black';
	}

	function changeVizMode(e) {
		viz_settings.mode = e.target.value;
		viz.changeMode(viz_settings.mode);
	}

	// ===================================
	//Public interface
	return {
		init : init
	};
})();