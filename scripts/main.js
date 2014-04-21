// just one module named main
app.main = (function(){

	// CONSTANTS
	const LASTFM_GETINFO_URL = "http://ws.audioscrobbler.com/2.0/?api_key=44c265a8aecc1c4a56dae9f8479a84ac&format=json&method=artist.getinfo&autocorrect=1&artist="
	const LASTFM_GETEVENTS_URL = "http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=44c265a8aecc1c4a56dae9f8479a84ac&format=json&autocorrect=1&artist="
	
  	// INSTANCE VARIABLES
    var map;
    var infowindow;
    var overlays;
    
    
    // PUBLIC METHODS
    function init(){
		// initializeMap() sets up the Google Map
		initializeMap(); 
	
		// Add events to UI
		$("#ajax-loader").hide();
	
		// Hook up event for button that is grouped with food text field
		$('#getbutton').on('click', function(event) {
			var term = $('#searchterm').val();
			if (term.length >= 1){
				initializeMap();
				onGetBand(encodeURIComponent(term)); // replace space with %20
			}
		});

    }; // end init
    
    function onArtistInfoLoaded(obj){
    	
		// alert(JSON.stringify(obj));
		var html = "";
		var results = obj.artist;
		console.log(results.name +" info loaded");
		html += "<div>";
		html += "<h2>" + results.name  + "</h2>\n";
  		html += "<p id='bio'>" + results.bio.content + "</p>";
  		html += "</div>"
	
		// // set html of #content div using jquery()
		$('#artistInfo').html(html);
		// $("#bio").shorten({
  //   		"showChars" : 200,
  //   		"moreText" : "See More",
  //   		"lessText" : "Less"
		// });



		 
	};

	function onArtistEventsLoaded(obj){
		
		results = obj.events;

		// if()
		var artist;
		var total;
		console.log(results);
		if (!obj.events['@attr']){
			artist = results.artist;
			total = results.total;
		}else{
			artist = results['@attr'].artist;
			total = (!results.event.length)? 1 : results.event.length ;
		}
		console.log(artist + ", "+ total +" events loaded");
		html = ""
		html += "<div>";
		html += "<h2>" + artist + " - Upcoming Events</h2>";
		
		if (total == 0){

			html += "<p>No upcoming events, sorry!</p>";

		}else{

			html +="<p>Hooray! There is some stuff here!</p>";
			// console.log("events: " + results.event);
			var latFirst = results.event[0].venue.location["geo:point"]["geo:lat"];
			var longFirst = results.event[0].venue.location["geo:point"]["geo:long"];
			var posFirst = new google.maps.LatLng(latFirst, longFirst);
			for(var i =0; i<total; i++){
				// console.log(results.event[i].venue.location["geo:point"]["geo:lat"]);
				html +="<h3>" + results.event[i].title + "</h3>";
				html += "<span class='lineup'>With: " + results.event[i].artists.artist + "</span>";
				if(!results.event[i].venue.website){
					html += "<div class='eInfo'>At: " + results.event[i].venue.name + "<br />" + results.event[i].venue.location.street + ", " + results.event[i].venue.location.city + ", " + results.event[i].venue.location.country +"<br />" + results.event[i].startDate + "</div>";

				}else{
					html += "<div class='eInfo'>At: " + results.event[i].venue.name + "<br />" + results.event[i].venue.location.street + ", " + results.event[i].venue.location.city + ", " + results.event[i].venue.location.country +"<br />" + results.event[i].startDate + "<br /><a href='"+ results.event[i].venue.website +"'>Find out more</a>"+ "</div>";
				}
				
				var latitude = results.event[i].venue.location["geo:point"]["geo:lat"];
				var longitude = results.event[i].venue.location["geo:point"]["geo:long"];
				var position = new google.maps.LatLng(latitude, longitude);
				var marker = new google.maps.Marker({
	      			position: position, 
	     			map: map
	  			});

				// var msg = results[0].name + "!";
				// makeInfoWindow(position,msg)
				

			}
			map.panTo(posFirst);
			map.setZoom(10);
		}
		html += "</div>";
		$('#events').html(html);


	};
	
	// PRIVATE CALLBACK METHODS

	// called when user clicks a search button
	function onGetBand(term){
		var getInfoUrl = LASTFM_GETINFO_URL + term;
		// alert(url);
		$.ajax({
				url: getInfoUrl,
				type: 'post',
				dataType: 'jsonp'
		}).done(function(data){
			onArtistInfoLoaded(data);
		});

		var getArtistEvents = LASTFM_GETEVENTS_URL + term;

		$.ajax({
			url: getArtistEvents,
			type: 'post',
			dataType: 'jsonp'
		}).done(function(data){
			onArtistEventsLoaded(data);
		})


	};
	


	// OTHER PRIVATE HELPER METHODS
	
	// Sets up Google Map
	function initializeMap() {
        var myOptions = {
          center: new google.maps.LatLng(43.083848,-77.6799),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // create google map 
         map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
	};

	
	// public interface
	return{
		init: init
		// onJSONLoaded: onJSONLoaded
	};
	
})(); // end app.main