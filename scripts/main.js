app.main = (function(){
	// global vars
	var synth;
	var viz;
	var viz_settings; // the "visualizer" object (holds settings)
	var order = ["delay","chorus","overdrive"];
	var effectSettings = {
		delay : {},
		chorus : {},
		overdrive : {}
	};
	var body;
  var ss = document.styleSheets[0];
  var rules = ss.cssRules || ss.rules;
  var played_CSS = null;

	function init (){
		$(document).foundation();
		body = document.getElementsByTagName('body')[0];
		body.className += 'black';

		var $content = $( "#content" );

		//detect mouse movement, reveal footer
		var timeout = null;
		var moving = false;
		var idleTime = 1500;
		$(document).on('mousemove', function() {
		    if (timeout !== null) {
		    		if(moving == false){
		        	$content.animate({ "top": "-16px" }, "fast" );
		        	moving = true;
		    		}
		        clearTimeout(timeout);
		    }

		    timeout = setTimeout(function() {
		    	if (!$('footer').is(':hover')) {
		        $content.animate({ "top": "0px" }, "fast", function(){
		        	moving = false;
		        });
			    }
		        
		    }, idleTime);
		});

		//read default knob vals, build intitial effectSettings
		$(".dial").each(function(index){
			var effect = $(this).closest(".accordion dd").attr("id");
			var prop = $(this).data("prop");
			var scale = parseInt($(this).data("scale"));
			var val = parseInt($(this).attr("value"));
			effectSettings[effect].bypass = 1;
			effectSettings[effect][prop] = val/scale;
		});

		//setup knobs
		var knobDefaults = {
			width: "80%", 
			fgColor : "#66CC66",
			angleOffset : -125,
			angleArc : 250,
			release: function(v){
				var effect = this.$.closest(".accordion dd").attr("id");
				var prop = this.$.data("prop");
				var scale = parseInt(this.$.data("scale"));
				effectSettings[effect][prop] = v/scale;

				synth.changeSettings(effectSettings);
			}
		}

		//bypass button click
		$(".toggle").on("click", function(event){
			var effect = $(this).closest(".accordion dd").attr("id");

			if($(this).hasClass("on")){
				//turn off
				$(this).removeClass("on");
				$(this).text("OFF");
				effectSettings[effect].bypass = true;
			}else{
				//turn on
				$(this).addClass("on");
				$(this).text("ON");
				effectSettings[effect].bypass = false;
			}
			synth.changeSettings(effectSettings);
		});

		// for smooth accordion opening
		$(".accordion dd").on("click", "a:eq(0)", function (event)
      {
        var dd_parent = $(this).parent();

        if(dd_parent.hasClass('active'))
          $(".accordion dd div.content:visible").slideToggle("fast");
        else
        {
          $(".accordion dd div.content:visible").slideToggle("fast");
          $(this).parent().find(".content").slideToggle("fast");
        }
      	dd_parent.find(".dial").knob(knobDefaults);
      });


		// SYNTH SETUP
		// ----------------------------
		var waves = $(".wave.button");
		var delayControl = $("#delay");
		var feedbackControl = $("#feedback");

		synth = new app.synth.Synth(effectSettings);

		console.log(synth);
		//set default node order
		synth.setNodeOrder(order);


		//detect clicks on wavetype buttons, set synth
		waves.each(function(index){
			$(this).on("click", function(){
				waves.each(function(indexo){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
				synth.setWaveType($(this).data("type"));
				viz.setColor($(this).data("color"));

			});
		});

		//to make accordion sortable
		$( "#sortable" ).sortable({
		    update: function( event, ui ) {
		    	var newOrder = $.map($(this).find('dd'), function(el) {
                    return $(el).attr('id');
                });
		    	order = newOrder;
		    	synth.setNodeOrder(order);
		    },
		    cancel: ".content,.range-slider,.range-slider-handle,.range-slider-active-segment"
		});



		// $('.dial').css({
		// 	"display": "inline"

		// });


		// VISUALIZER SETUP
		// ----------------------------
		viz_settings = {color: $("#sine").data("color"), bgColor: "rgb(0,0,0)", mode: "one"};  // 1. create the viz_settings object

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