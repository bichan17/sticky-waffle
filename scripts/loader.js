var app = {}; //global var

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//load all libraries and scripts
		load: ["bower_components/jquery/dist/jquery.min.js","bower_components/jquery-ui/ui/minified/jquery-ui.min.js","bower_components/foundation/js/foundation.min.js","scripts/tuna.js","scripts/utils.js", "scripts/note.js", "scripts/synth.js", "scripts/visualizer.js", "scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");

			//run init
			app.main.init();
		}
	}
	]); //end Modernizer.load
}); //end addEventListener