app.main = (function(){
	// global vars
	var synth;
	var viz;
	var viz_settings; // the "visualizer" object (holds settings)
	var order = ["overdrive","chorus","delay","convolver"];
	var effectSettings = {
		delay : {},
		chorus : {},
		overdrive : {},
		convolver: {}
	};
  var ss = document.styleSheets[0];
  var rules = ss.cssRules || ss.rules;
  var played_CSS = null;

	function init (){


		function makeMenu(){
			$("#cWrap").addClass("off-canvas-wrap");
			$("#iWrap").addClass("inner-wrap");
			$("#iWrap aside").addClass("left-off-canvas-menu");
			$("#effects").show();
			$("#wavetypes").show();

		}
		function breakMenu(){
			$("#cWrap").removeClass("off-canvas-wrap");
			$("#iWrap").removeClass("inner-wrap");
			$("#iWrap aside").removeClass("left-off-canvas-menu");
		}

		//check for small screen, make menu
		if($(window).width() <= 1024){
			makeMenu();
		}

		$(window).resize(function(){
      if($(window).width() <= 1024){
				makeMenu();
			}else{
				breakMenu();
			}
    });

		//run foundation
		$(document).foundation({
			offcanvas: {
		    close_on_click: false
		  }
		});


		//detect mouse movement, reveal footer
		var $content = $( "#content" );
		var timeout = null;
		var moving = false;
		var idleTime = 1500;
		$(document).on('mousemove', function() {
		    if (timeout !== null) {
		    		if(moving == false){
		        	$content.animate({ "top": "-22px" }, "fast" );
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
			var $this = $(this);
			var effect = $this.closest(".accordion dd").attr("id");
			var prop = $this.data("prop");
			var scale = parseInt($this.data("scale"));
			var val = parseInt($this.attr("value"));
			effectSettings[effect].bypass = 1;
			effectSettings[effect][prop] = val/scale;
		});

		//setup knobs
		var knobDefaults = {
			width: "80",
			height: "80",
			fgColor : "#ffffff",
			bgColor:"rgba(255, 255, 255, 0.3)",
			angleOffset : -125,
			angleArc : 250,
			release: function(v){
				var $this = this.$;
				var effect = $this.closest(".accordion dd").attr("id");
				var prop = $this.data("prop");
				var scale = parseInt($this.data("scale"));
				effectSettings[effect][prop] = v/scale;

				synth.changeSettings(effectSettings);
			}
		}

		//bypass button click
		$(".toggle").on("click", function(event){
			var $this = $(this);

			var effect = $this.closest(".accordion dd").attr("id");

			if($this.hasClass("on")){
				//turn off
				$this.removeClass("on");
				$this.text("OFF");
				effectSettings[effect].bypass = true;
			}else{
				//turn on
				$this.addClass("on");
				$this.text("ON");
				effectSettings[effect].bypass = false;
			}
			synth.changeSettings(effectSettings);
		});

		// for smooth accordion opening
		$(".accordion dd").on("click", "a:eq(0)", function (event)
      {
        var dd_parent = $(this).parent();
        var index = $( "dd" ).index( dd_parent );
        var num = $( "#numbers li" )[index];

        var speed = 200;

        //start up knob
        dd_parent.find(".dial").knob(knobDefaults);

        if(dd_parent.hasClass('active')){
        	console.log("close");
          $(".accordion dd div.content:visible").slideToggle({
          	duration: speed,
          	start: function(){
			      	$( "#numbers li" ).css( "margin-bottom", '0' );
          	},
				    step: function( now, fx ){
				      if(fx.prop =="height"){
				      	$(num).css( "margin-bottom", now );
				      }
				    }
          });
        }
        else
        {
				  //close prev
          $(".accordion dd div.content:visible").slideToggle({
          	duration: speed,
				    start: function( promise ){
			      	$( "#numbers li" ).animate({"margin-bottom": "0"}, speed);
				    }
          });
          //open new
          $(this).parent().find(".content").slideToggle({
          	duration: speed,
				    step: function( now, fx ){
				      if(fx.prop =="height"){
				      	$(num).css( "margin-bottom", now );
				      }
				    }
          });
        }
      });


		// SYNTH SETUP
		// ----------------------------
		var waves = $(".wave");
		var delayControl = $("#delay");
		var feedbackControl = $("#feedback");

		synth = new app.synth.Synth(effectSettings);

		// console.log(synth);
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
			change: function(event, ui){
				var dd = $(this).find("dd");
				var index;
				var height = 0;
				var filter = $.grep(dd, function(val){
					return val != ui.item[0];
				});

				if(ui.placeholder.is(".active")){
					//grabbing active
					index = $(filter).index(ui.placeholder);
					var content = ui.item.find(".content");
					height = $(content).outerHeight();
				}else{
					//grabbing inactive
					var active = $(this).find(".accordion-navigation.active:not(.ui-sortable-placeholder)");
					var open = active.length != 0;
					//find if there are active panels open
					if(open){
						//get active panel index
						index = $(filter).index(active[0]);
						var content = $(active[0]).find(".content");
						height = content.outerHeight();
					}
				}
				//which number to add margin to
        var num = $( "#numbers li" )[index];


      	$( "#numbers li" ).css("margin-bottom","0");


        $(num).css("margin-bottom", height);

				

			},
	    update: function( event, ui ) {
	    	var newOrder = $.map($(this).find('dd'), function(el) {
                  return $(el).attr('id');
              });
	    	order = newOrder;
	    	synth.setNodeOrder(order);
	    },
	    cancel: ".content,.toggle,dd a,.range-slider,.range-slider-handle,.range-slider-active-segment"
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