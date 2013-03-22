// Declare other classes with app.someClass = (function(){

// })();


app.main = (function(){
	function init (){
		console.log("initialized!");
	}

	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();