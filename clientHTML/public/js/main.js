
var graphStructure={
	"GPS Speed":{"type":"Graph", "displayed":true},
	"GPS Bearing":{"type":"Graph", "displayed":false},
	"Fuel rate":{"type":"Graph", "displayed":false},
	"Turbo Boost":{"type":"Graph", "displayed":false},
	"Voltage":{"type":"Graph", "displayed":false},
	"Accelerometer (X)":{"type":"Graph", "displayed":false},
	"Accelerometer (Y)":{"type":"Graph", "displayed":false},
	"Accelerometer (Z)":{"type":"Graph", "displayed":false},
	"Accelerometer (Total)":{"type":"Graph", "displayed":false},
	"GPS vs OBD speed diff":{"type":"Graph", "displayed":false},
	"Accelerator PedalPosition D":{"type":"Graph", "displayed":false},
	"Ambient air temp":{"type":"Graph", "displayed":false},
	"Accelerator PedalPosition E":{"type":"Graph", "displayed":false},
	"Relative Throttle Position":{"type":"Graph", "displayed":false},
	"Barometric pressure (from vehicle)":{"type":"Graph", "displayed":false},
	"Barometer (on Android device)":{"type":"Graph", "displayed":false},
	"Fuel Rail Pressure":{"type":"Graph", "displayed":false},
	"Fuel flow rate/hour":{"type":"Graph", "displayed":false},
	"Catalyst Temperature (Bank 1 Sensor 1)":{"type":"Graph", "displayed":false},
	"Fuel used (trip)":{"type":"Graph", "displayed":false},
	"Fuel Remaining (Calculated from vehicle profile)":{"type":"Graph", "displayed":false},
	"Engine kW (At the wheels)":{"type":"Graph", "displayed":false},
	"Kilometers Per Litre(Instant)":{"type":"Graph", "displayed":false},
	"Kilometers Per Litre(Long Term Average)":{"type":"Graph", "displayed":false},
	"Distance to empty (Estimated)":{"type":"Graph", "displayed":false},
	"GPS LatLong":{"type":"Map", "displayed":true}
};



function toggleGraph(inKey, inInputbox) {
	if (graphStructure[inKey].displayed==false) {
		buildGraph(inKey, currentTrip);
		
	}
	var container = document.getElementById(inKey);
	if (inInputbox.checked) {
		container.style.display='block';
	} else {
		container.style.display='none';
	}
	
}

var eventsArray=[];
var currentTrip=0;
function showGraph(event, properties) {
   	  
   	var index=parseInt(properties.items[0].substring(5));
   	currentTrip=index;
   	var startTime=new Date(tripsArray[index].doc.startTime);
   	var endTime=new Date(tripsArray[index].doc.endTime);
   	var eventCount=tripsArray[index].doc.eventCount;
   	var startTimeString=startTime.toUTCString();
   	var endTimeString=endTime.toUTCString();
	startTimeString=startTimeString.substring(0,startTimeString.length-3);
	endTimeString=endTimeString.substring(0,endTimeString.length-3);

	var visContainer = document.getElementById('Visualisation');
	$('#tripStartDate').html('Start: ' + startTimeString);  	
   	$('#tripEndDate').html('End: ' + endTimeString);  	
   	$('#tripEventCount').html('# Events: ' + eventCount);
	visContainer.innerHTML='';

   	//download all events
   	$.getJSON( '/db/_all_docs?startkey="event:' + tripsArray[index].doc.startTime + '"&endkey="event:' + tripsArray[index].doc.endTime + '"&include_docs=true' , function( indata ) {
		eventsArray=indata.rows;


		//graphStructure
		var outHTML='';
		var graphContainers='';
		var checked='checked';
		for(var key in graphStructure) {
		    var value = graphStructure[key];
		    outHTML=outHTML+'<br /><input type="checkbox" ' + checked + ' onclick="toggleGraph(\'' + key + '\',this)">' + key + '</input>';
		    checked='';  //set first input as checked
		    graphContainers= graphContainers + '<div style="border:1px; solid black; padding:5px;" id="' + key + '"></div>' ;
		    //alert(value);
		    graphStructure[key].displayed=false;

		}
		//alert(outHTML);
		$('#tripGraphOptions').html(outHTML);
		
		$('#Visualisation').html(graphContainers);
		//alert(graphContainers);
		buildGraph('GPS Speed', index);


	});
}



function buildGraph(graphType, tripNumber)	{ //assume global variable eventsArray already exists
	
	//var graphContainer=graphStructure[graphType];
	var container = document.getElementById(graphType);
	graphStructure[graphType].displayed=true;
	//visContainer.innerHTML=visContainer.innerHTML+'<div id="' + graphType + '"></div>';
	//var container = document.getElementById(graphType);
	var items = [];
	for(var i=0;i<eventsArray.length;i=i+1){
	  	var eventId=eventsArray[i].id;
	  	eventId=parseInt(eventId.substring(6));
	  	var eventValue=parseFloat(eventsArray[i].doc[graphType]);
	  	//alert(GPSSpeed);
	  	var eventObject={x: eventId , y: eventValue, content: eventValue, group: 0};
	  	items.push(eventObject);
	}
	var groups = new vis.DataSet();
	groups.add({
	    id: 0,
	    content: graphType,
	    options: {
	        drawPoints: {
	            style: 'square' // square, circle
	        },
	        shaded: {
	            orientation: 'bottom' // top, bottom
	        }
	}});
	 
	var dataset = new vis.DataSet(items);
	var options = {
	    start: tripsArray[tripNumber].doc.startTime,
	    end: tripsArray[tripNumber].doc.endTime,
	    catmullRom : false,
	    height: '200px',
	    shaded: {enabled:true},
	    legend: true,
	    drawPoints: {enabled:true, size:2,style:'circle'}
	  };
	  
	var graph2d = new vis.Graph2d(container, dataset, groups, options);
	//alert(JSON.stringify(eventsArray[0]));
}



var tripsArray;
function showTimeline(startDate, endDate, divContainer)
{

	var peopleObject=[{Name:'Trip', start:null, end:null, content:null}];
								
	var timelineObjectArray=[];
	var ObjectId=1;

	//alert(oneWeekAgo);
    $.getJSON( '/db/_all_docs?startkey="trip:0"&endkey="trip:9999999999"&include_docs=true' , function( indata ) {
			  //alert(JSON.stringify(data));
			  var jsonTrips=indata;
			  tripsArray=jsonTrips.rows;

			  // create a data set with groups
			  //var names = ['John', 'Alston', 'Lee', 'Grant'];
			  var groups = new vis.DataSet();
			  for (var g = 0; g < peopleObject.length; g++) {
			    groups.add({id: g, content: peopleObject[g].Name});
			  }
			  
			  for(var i=0;i<tripsArray.length;i++){
			  	var tripId=tripsArray[i].id;
			  	var tripDate=tripsArray[i].doc.startTime;
			  	var tripDataObj=new Date(parseInt(tripDate));
			  	var theDate=tripDataObj.toString();
			  	
			  	var newObject={id:tripId, content:theDate, start:tripsArray[i].doc.startTime, end: tripsArray[i].doc.endTime, group:0};
			  	timelineObjectArray.push(newObject);
			  	}
			  
			 
			    // DOM element where the Timeline will be attached
			    var container = document.getElementById(divContainer);

			    // Create a DataSet with data (enables two way data binding)
			    /*var data = new vis.DataSet([
			      {id: 1, content: 'item 1', start: '2013-04-20'},
			      {id: 2, content: 'item 2', start: '2013-04-14'},
			      {id: 3, content: 'item 3', start: '2013-04-18'},
			      {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
			      {id: 5, content: 'item 5', start: '2013-04-25'},
			      {id: 6, content: 'item 6', start: '2013-04-27'} 
			    ]);*/
				var items = new vis.DataSet(timelineObjectArray);
			    

 


			    // Configuration for the Timeline
			    var options = {start:startDate,end: endDate, groupOrder:'content'};
			    var margin={};
				margin.item={};
				margin.item.horizontal=0;
				options.margin=margin;
			    //alert(container.innerHTML);
			    // Create a Timeline

			    var timeline = new vis.Timeline(container);
				timeline.setOptions(options);
				timeline.setGroups(groups);
				timeline.setItems(items);
			    //alert(container.innerHTML);
    			
    			timeline.on('select', function (properties) {
			      showGraph('select', properties);
			    });

			    


			});
}




(function ($) {
  $(document).ready(function () {
    // you awesome code goes here
    var startDate;
    var endDate;
    var oneDayInMillis;
    var dateNow;
    var startDateNum;
    var endDateNum;
    dateNow=new Date();
	oneDayInMillis=1*24*60*60*1000;
	startDate=new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 6, 0, 0, 0);
	endDate=new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 23, 59, 59, 999);


	startDateNum=startDate.getTime();
	endDateNum=endDate.getTime();
	startDateNum=startDateNum-10*oneDayInMillis; // show from 10 days ago
	
	showTimeline(startDateNum,endDateNum,'mytimeline');
		
  });
})(jQuery);
