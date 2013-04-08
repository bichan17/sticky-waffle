var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["scripts/utils.js", "scripts/synth.js", "scripts/particle.js", "scripts/visualizer.js", "scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");

			//run init
			app.main.init();
		}
	}
	]); //end Modernizer.load
}); //end addEventListener