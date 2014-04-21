var app = {};

//wait until main document is loaded
window.addEventListener("load",function(){
	//start dynamic loading
	Modernizr.load([{
		//these files are always loaded
		load: ["http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", "scripts/main.js"],

		//called when all files have finished loading and executing
		complete: function(){
			console.log("all files loaded!");

			//run init
			app.main.init();

		}
	}
	]); //end Modernizer.load
}); //end addEventListener