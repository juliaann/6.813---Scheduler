
$(document).ready(function() {
	var heightHeader = $('#header').height();
	var heightPending = $('#pendingHeader').height();
	var topCalendar = parseInt(heightHeader) + parseInt(heightPending) + 20;
	$('#calendarPanel').offset({top: topCalendar});

});
