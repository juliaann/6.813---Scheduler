
$(document).ready(function() {
	var heightHeader = $('#header').height();
	var heightPending = $('#pendingHeader').height();
	var topCalendar = parseInt(heightHeader) + parseInt(heightPending);
	console.log(document.getElementById('header'));
	console.log(heightHeader);
	console.log(heightPending);
	topCalendar = topCalendar;
	console.log(topCalendar);
	$('#calendarPanel').offset({top: topCalendar});

});
