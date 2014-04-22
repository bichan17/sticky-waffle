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
		var filterControl = document.querySelector("#filter-type");
		var delayControl = document.querySelector("#delay");
		var feedbackControl = document.querySelector("#feedback");

		synth = new app.synth.Synth(wavetypeControl, filterControl, delayControl, feedbackControl);


		// VISUALIZER SETUP
		// ----------------------------
		viz_settings = {}; // 1. create the viz_settings object
		// 2. set up UI
		// 
		// visualizer colors
		var colorButtons = document.getElementById('color').getElementsByTagName('input');
		for (var i = 0; i < colorButtons.length; i++) {
			colorButtons[i].addEventListener("change", changeColor, false);
			// get the default checked value
			if (colorButtons[i].checked){viz_settings.color = colorButtons[i].value;}
		}

		// background colors
		var bkgdColorButtons = document.getElementById('bkgd').getElementsByTagName('input');
		for (var k = 0; k < bkgdColorButtons.length; k++) {
			bkgdColorButtons[k].addEventListener("change", changeBackgroundColor, false);
			// get the default checked value
			if (bkgdColorButtons[k].checked){viz_settings.bkgd_color = bkgdColorButtons[k].value;}
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

		// the good stuff
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
		viz_settings.color = e.target.value;
		viz.changeColor(viz_settings.color);
	}

	function changeBackgroundColor(e) {
		// change <canvas> colors
		viz_settings.bkgd_color = e.target.value;
		viz.changeBackground(viz_settings.bkgd_color);

		// change DOM colors and classNames
		body.className = ''; // clear classNames
		if (viz_settings.bkgd_color === 'rgb(0,0,0)') body.className += 'black';
		else if (viz_settings.bkgd_color === 'rgb(255,255,255)') body.className += 'white';
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