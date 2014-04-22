app.particle = (function(){
	// vars
	var gravity = 1, // = 4.8,
			baseRadius;

	// Particle Factory
	function createParticle(ctx, I, _fill){
		I.FPS = 60;
		I.frame = 0;
		I.fill = _fill;

		// random velocity
		I.vx = Math.random()*6-3;
		I.vy = -1 * (Math.random() * 2 + 1);

		//Random size
		baseRadius = I.base_radius;
		I.radius = baseRadius; // Math.random() * baseRadius + baseRadius;
		I.width = I.height = I.radius * 2;

		// Methods
		I.update = function(){
			this.frame ++;
			this.vx *= 0.998; // air friction
			this.vy = this.vy + ((gravity/this.FPS) * this.frame * this.frame)/(this.FPS * this.FPS);
			this.x += this.vx*4;
			this.y += this.vy*2;
		};

		I.draw = function(ctx){
			// ctx.fillStyle = gradient;
			ctx.fillStyle = this.fill;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, Math.PI*2, false);
			ctx.closePath();
			ctx.fill();
		};

		return I;
	}

	// Setters
	function setGravity(value){
		gravity = value;
	}

	function setBaseRadius(value){
		baseRadius = value;
		console.log(baseRadius);
	}

	// public interface
	return {
		createParticle : createParticle,
		setGravity : setGravity,
		setBaseRadius : setBaseRadius
	};

})();

// http://thecodeplayer.com/walkthrough/make-a-particle-system-in-html5-canvas