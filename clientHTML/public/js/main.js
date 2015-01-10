function showTimeline(startDate, endDate, divContainer)
{

	var peopleObject=[{Name:'Trip', start:null, end:null, content:null}];
								
	var timelineObjectArray=[];
	var ObjectId=1;
	var queryStartDate;
	var queryEndDate;
	queryStartDate=startDate-(18*60*60*1000); // begin query 12 hours before 6 am
	queryEndDate=endDate+(12*60*60*1000); // end query 12 hours after midnight
	//alert(oneWeekAgo);
    $.getJSON( '/db/_all_docs?startkey="trip:0"&endkey="trip:9999999999"&include_docs=true' , function( indata ) {
			  //alert(JSON.stringify(data));
			  var jsonTrips=indata;
			  var tripsArray=jsonTrips.rows;

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

	for(var x=0;x<7;x++) {
		showTimeline(startDateNum, endDateNum, 'mytimeline'+x);
		startDateNum=startDateNum-oneDayInMillis;
		endDateNum=endDateNum-oneDayInMillis;
	}

  });
})(jQuery);
