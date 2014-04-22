// just one module named main
app.main = (function(){

	// CONSTANTS
	const LASTFM_GETINFO_URL = "http://ws.audioscrobbler.com/2.0/?api_key=44c265a8aecc1c4a56dae9f8479a84ac&format=json&method=artist.getinfo&autocorrect=1&artist="
	const LASTFM_GETEVENTS_URL = "http://ws.audioscrobbler.com/2.0/?method=artist.getevents&api_key=44c265a8aecc1c4a56dae9f8479a84ac&format=json&autocorrect=1&artist="
	
	// INSTANCE VARIABLES
	var map;
  var infowindow;
  var overlays;

  console.log(app);

    
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

		var html = "";
		var results = obj.artist;
		html += "<div>";
		html += "<h2>" + results.name  + "</h2>\n";
		html += "<p id='bio'>" + results.bio.content + "</p>";
		html += "</div>";
		$('#artistInfo').html(html);
	};

	function onArtistEventsLoaded(obj){
		
		results = obj.events;
		var artist;
		var total;
		if (!obj.events['@attr']){
			artist = results.artist;
			total = results.total;
		}else{
			artist = results['@attr'].artist;
			total = (!results.event.length)? 1 : results.event.length ;
		}
		html = ""
		html += "<div>";
		html += "<h3>" + artist + "</h3>";
		html += "<h4 class='num'>" + total + " Upcoming Events</h4>";

		
		if (total == 0){

			html += "<p>No upcoming events, sorry!</p>";

		}else{
			// console.log("events: " + results.event);
			var pointFound = false;
			
			var posFirst;
			for(var i =0; i<total; i++){
				// console.log(results.event[i].venue.location["geo:point"]["geo:lat"]);
				if(pointFound == false){
					var latFirst = results.event[i].venue.location["geo:point"]["geo:lat"];
					var longFirst = results.event[i].venue.location["geo:point"]["geo:long"];

					if(latFirst !="" && longFirst != ""){
						posFirst = new google.maps.LatLng(latFirst, longFirst);
						pointFound= true;
					}

				}
				var image = new google.maps.MarkerImage('images/marker' + (i+1) + '.png',
                    new google.maps.Size(20, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34));
				
				var latitude = results.event[i].venue.location["geo:point"]["geo:lat"];
				var longitude = results.event[i].venue.location["geo:point"]["geo:long"];
				var position = new google.maps.LatLng(latitude, longitude);
				var marker = new google.maps.Marker({
	      			position: position,
	      			icon: image,
	     			map: map
	  			});
				html +="<h4>"+ (i+1) + ": " + results.event[i].title + "</h4>";
				
				// html +="<h4>"+ (i+1) + ": <a href='#' onclick='app.map.panTo(" + position + ");'> " + results.event[i].title + "</a></h4>";
				html += "<span class='lineup'>With: " + results.event[i].artists.artist + "</span>";
				if(!results.event[i].venue.website){
					html += "<div class='eInfo'>At: " + results.event[i].venue.name + "<br />" + results.event[i].venue.location.street + ", " + results.event[i].venue.location.city + ", " + results.event[i].venue.location.country +"<br />" + results.event[i].startDate + "</div><hr>";

				}else{
					html += "<div class='eInfo'>At: " + results.event[i].venue.name + "<br />" + results.event[i].venue.location.street + ", " + results.event[i].venue.location.city + ", " + results.event[i].venue.location.country +"<br />" + results.event[i].startDate + "<br /><a href='"+ results.event[i].venue.website +"'>Find out more</a>"+ "</div><hr>";
				}
			}
			if(pointFound == true){
				map.panTo(posFirst);
				map.setZoom(10);
			}
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
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	};

  

	return{
		map: map,
		init: init
	};
	
})(); // end app.main

console.log(app);