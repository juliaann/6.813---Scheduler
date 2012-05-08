// Useful global variables for updating the calendar view via user mouse clicks
var cursorImage = "";
var imagePath = "/static/images/";
var isAdmin;
//[status, date, time, discipline]
var instructorSchedule;
var validShifts;
var cnt = 0;
var accepted;


// Arrays of the sidebar buttons for for loops -- note: these must remain
// in this order -- for loops should be surrounded in a try/catch block
// and so will catch errors and stop as soon as they hit the admin-only buttons
// so those should all be last
var sidebarIds = ["adultSki", "adultSnowboard", "childrenSki",
                  "childrenSnowboard", "racing", "eraser", "arrow",
                  "excused", "absent", "excuseCancel", "absentCancel"];

// Keep track of the original state of each pending change
var pendingChanges = new Object();

// Adds a click listener to the element (in the sidebar panel) specified by id
function addSidebarClickListener(id) {
    var button = document.getElementById(id);
    if (button.addEventListener) {
        button.addEventListener('click', sidebarButtonClicked, false);
    }
}

// Adds a click listener to the shift button specified by id
function addShiftClickListener(id) {
    var button = document.getElementById(id);
    if (button.addEventListener) {
        button.addEventListener('click', shiftClicked, false);
    }
}

//Load all data from response into memory
//Need whether instructor is admin, whose calendar is being viewed, what possible shifts are, and
//what scheduled shifts are
function loadData(res, status){
	var response = JSON.parse(res.responseText);
	isAdmin = response.isAdmin;
	instructorSchedule = response.shifts;
	console.log(instructorSchedule);
	validShifts = response.validShifts;
	accepted = response.accepted;
	console.log(accepted);
	loadInitialShifts();

}

//Add a pending message
//Takes in a shift, which is an array in the format of [status, date, time, discipline]
function addPendingMsg(shift){
	console.log("in add pending");
	console.log(accepted);
	if(accepted == "True"){
		table = document.getElementById("pendingChangesTable");
		var row = table.insertRow(-1);
		var cell0 = row.insertCell(0);
		var date = formatDate(shift[1]);
		cell0.innerHTML = shift[3] + ": " + shift[2].charAt(0).toUpperCase() + shift[2].slice(1) + " on " + date + " is " + shift[0]
		if(isAdmin == "True"){
			var cell1 = row.insertCell(1);
			cell1.innerHTML = "<input type='radio' name=" + cnt + " value='Accept'>"
			cell1.className = ("acceptColumn");
			var cell2 = row.insertCell(2);
			cell2.innerHTML = "<input type='radio' name=" + cnt + " value='Reject'>"
			cell2.className = ("rejectColumn");
			cnt++;
		}
	}

}

//delete the pending message (because the instructor no longer wants to change the shift)
function deletePendingMsg(date, time, discipline){
	console.log("in delete pending");
	if(accepted == "True"){
		if(time == "morning"){
			time = "day";
		}
		if(discipline == "Racing"){
			discipline = "Race";
		}
		table = document.getElementById("pendingChangesTable");
		for(var i = 0, row; row = table.rows[i]; i++){
			console.log("row");
			console.log(row);
			    msg = row.cells[0].innerHTML;

			    // Get the text and parse out the discipline, time, date, and status
			    var msgDiscipline = msg.substring(0, msg.indexOf(":"));
			    msg = msg.substring(msg.indexOf(":")+2); // ignore ": "

			    var msgTime = msg.substring(0, msg.indexOf(" "));
			    msg = msg.substring(msg.indexOf(" ")+4); // ignore " on "

			    var msgDate = msg.substring(0, msg.indexOf(" is"));
			    var status = msg.substring(msg.indexOf(" is")+12);
				
			    console.log(msgDate);
			    console.log(msgTime);
			    console.log(msgDiscipline);
			    console.log(formatDate(date));
			    console.log(time);
			    console.log(discipline);
			    if(msgDate == formatDate(date) && msgTime.toLowerCase() == time && msgDiscipline == discipline){
			    	table.deleteRow(i);
			    	console.log("deletedRow");
			    	return;
			    }
	
		}
	}
}

function formatDate(date){
	var year = date.slice(0,4);
	var month = date.slice(5,7);
	var day = date.slice(8,10);
	if (month == "12"){
		month = "Dec.";
	}else if(month == "01"){
		month = "Jan.";
	}else if(month == "02"){
		month = "Feb.";
	}else if(month == "03"){
		month = "Mar.";
	}
	return month + " " + day + ", " + year;
}

//Set the initial images for the shifts that the instructor is scheduled for
//Set message for pending shifts
function loadInitialShifts(){
    if (instructorSchedule != undefined){
        for (var s = 0; s < instructorSchedule.length; s++){
        	if (instructorSchedule[s][2] == "day"){
        		var id = instructorSchedule[s][1] + "morning";
        	}else{
        		var id = instructorSchedule[s][1] + instructorSchedule[s][2]
        	}
        	if (instructorSchedule[s][0] == "Pending Add"){
        		setPendingImage(id, imagePath + getNameImage(instructorSchedule[s][3]), true);
        		addPendingMsg(instructorSchedule[s]);
        	}else if (instructorSchedule[s][0] == "Pending Delete"){
        		setPendingImage(id, imagePath + getNameImage(instructorSchedule[s][3]), false);
        		addPendingMsg(instructorSchedule[s]);
        	}else{
        		setShiftImage(id, imagePath + getNameImage(instructorSchedule[s][3]));
        		if (instructorSchedule[s][0] == "Absent"){
        			setShiftOverlayImage(id, imagePath + "absent.png");
        		}else if (instructorSchedule[s][0] == "Excused"){
        			setShiftOverlayImage(id, imagePath + "excused.png");
        		}
        	}
        }
        // Add click listeners to the radio buttons (pending changes for admin)
        var pendingTable = document.getElementById("pendingChangesTable");
        var pendingRows = pendingTable.rows;
        for (var i = 0; i < pendingRows.length; i++) {
            var pendingCells = pendingRows[i].cells;
            if (pendingCells.length > 0) {
                var acceptButton = pendingCells[1].firstChild;
                var rejectButton = pendingCells[2].firstChild;
                acceptButton.addEventListener('click', radioButtonClicked, false);
                rejectButton.addEventListener('click', radioButtonClicked, false);
            }
        }
    }

}

function submitSuccess(){
	
}

// Add the click listener to each sidebar button
$(document).ready(function() {
     var instructor = document.getElementById("instructor").innerHTML;
     instructor = instructor.replace("'s Schedule", "");
     var data = {name: instructor};
     var args = { type:"POST", url:"/calendar/getSchedule/", data:data, complete:loadData };

     $.ajax(args);
    //Add click listener to submit button
    $("#submit").click( function() {
	console.log("submit");
	var subSch = confirm("Are you sure you want to submit your schedule?");
	if (subSch == true){
		console.log(instructorSchedule);
		var submitSchedule = [];
		for(var k = 0; k < instructorSchedule.length; k++){
			submitSchedule = submitSchedule.concat(instructorSchedule[k]);
		}
		console.log(submitSchedule);
		data = {name: instructor, instructorShifts: submitSchedule.toString(), isApproval: "False"};
		console.log(data);
		var args = { traditional: true, 
				type:"POST", 
				url:"/submitSchedule/", 
				dataType: "text", 
				data:data,
				complete: function(){
					top.location.href = "/submitSuccess";
				}};
		$.ajax(args);
	}
    });
    
    //Add a click listener to the accept button 
    $("#acceptScheduleButton").click( function() {
    	var approveSch = confirm("Are you sure you want to approve this schedule?");
    	if(approveSch == true){
        	for(var s=0; s <  instructorSchedule.length; s++){
        		if(instructorSchedule[s][0] == "Pending Add" || instructorSchedule[s][0] == "Pending Delete"){
        			var date = instructorSchedule[s][1];
        			var time = instructorSchedule[s][2];
        			var shiftID = date + time; 
        			console.log(shiftID);
        			changeStatus(shiftID, "Normal");
        		}
        	}
    		var submitSchedule = [];
    		for(var k = 0; k < instructorSchedule.length; k++){
    			submitSchedule = submitSchedule.concat(instructorSchedule[k]);
    		}
    		console.log(submitSchedule);
    		data = {name: instructor, instructorShifts: submitSchedule.toString(), isApproval: "True"};
    		console.log(data);
    		var args = { traditional: true, 
    				type:"POST", 
    				url:"/submitSchedule/", 
    				dataType: "text", 
    				data:data,
    				complete: function(){
    					top.location.href = "/submitSuccess";
    				}};
    		$.ajax(args);
        	
    	}
    });
    // Add the click listener to the buttons for everybody
    try {
        for (var i = 0; i < sidebarIds.length; i++) {
            addSidebarClickListener(sidebarIds[i]);
        }
    } catch(err) { }

    // Add click listeners to the shift buttons
    var yearMonths = ["2012-12", "2013-01", "2013-02", "2013-03"];
    for (var midx = 0; midx < yearMonths.length; midx++) {
        var yearMonth = yearMonths[midx];

        for (var day = 1; day <= 31; day++) {
            var date = yearMonth + "-" + day;
            
            if (day < 10) {
                date = yearMonth + "-0" + day;
            }

            var shifts = ["morning", "evening", "night"];
            for (var sidx = 0; sidx < shifts.length; sidx++) {
                try {
                    addShiftClickListener(date + shifts[sidx]);
                } catch(err) { }
            }
        }
    }

});

function radioButtonClicked(e) {
    // Find the message corresponding to this radio button
    var msg = "INVALID";
    var pendingTable = document.getElementById("pendingChangesTable");
    var pendingRow = pendingTable.rows[parseInt(this.name)+1];
    msg = pendingRow.cells[0].innerHTML;

    // Get the text and parse out the discipline, time, date, and status
    var discipline = msg.substring(0, msg.indexOf(":"));
    msg = msg.substring(msg.indexOf(":")+2); // ignore ": "

    var time = msg.substring(0, msg.indexOf(" "));
    msg = msg.substring(msg.indexOf(" ")+4); // ignore " on "

    var date = msg.substring(0, msg.indexOf(" is"));
    var status = msg.substring(msg.indexOf(" is")+12);

    // Figure out the id for the shift button based on the date and time
    var spaceIdx = date.indexOf(" ");
    var commaIdx = date.indexOf(",");
    var monthStr = date.substring(0, spaceIdx);
    var monthToNumber = {"Dec.":"12", "Jan.":"01", "Feb.":"02", "Mar.":"03"};
    var month = monthToNumber[monthStr];
    var dayStr = date.substring(spaceIdx+1, commaIdx);
    var day = (parseInt(dayStr) < 10) ? "0" + parseInt(dayStr) : dayStr;
    var year = date.substring(commaIdx+2);
    time = (time == "Day") ? "Morning" : time; // morning not day
    var id = year + "-" + month + "-" + day + time.toLowerCase();

    // If it's a pending Add, get the image and set the shift to that image
    if (status == "Add") {
        if (this.value == "Accept") {
            // Get the image
            var image = getNameImage(discipline);

            // Store the original shift value, if one exists
            pendingChanges[id] = document.getElementById(id).innerHTML;
    
            // Set the image for that shift
            setShiftImage(id, imagePath + image);

        } else {
            // Reset to the original image
            restoreShiftImage(id);
        }
    }

    // If it's a pending Delete, clear the shift
    else if (status == "Delete") {
        if (this.value == "Accept") {
            // Store the original shift value, if one exists
            pendingChanges[id] = document.getElementById(id).innerHTML;

            // Clear the shift image
            clearShiftImage(id);
        } else {
            // Reset to the original image
            restoreShiftImage(id);
        }
    }
}

//Gets the name of an image given a discipline
function getNameImage(discipline){
    var image;
    if (discipline == "Adult Ski") {
        image = "adultSki.png";
    } else if (discipline == "Adult Board") {
        image = "adultSnowboard.png";
    } else if (discipline == "Child Ski") {
        image = "childrenSki.png";
    } else if (discipline == "Child Board") {
        image = "childrenSnowboard.png";
    } else if (discipline == "Racing" || discipline == "Race") {
        image = "racing.png";
    }
    return image
}
// Sets the appropriate class name for the shift button, effectively setting
// its background color
function setAppropriateClassName(id) {
    b = document.getElementById(id);
    if (!hasDiscipline(id)) {
        b.className = "defaultButton";
    } else if (b.id.indexOf("morning") != -1) {
        b.className = "dayButton";
    } else if (b.id.indexOf("evening") != -1) {
        b.className = "eveningButton";
    } else if (b.id.indexOf("night") != -1) {
        b.className = "nightButton";
    }
}

// Given an element id, restore the previous image (from pendingChanges)
function restoreShiftImage(id) {
    var previous = pendingChanges[id];
    if (typeof previous != "undefined") {
        document.getElementById(id).innerHTML = previous;
        setAppropriateClassName(id);
    }
}

// Given an element id and an image, sets the image src in the innerHTML
function setShiftImage(id, image) {
    // Set the image
    var b = document.getElementById(id);
    b.innerHTML = '<img class="calendarImage" src="' + image + '">';
    setAppropriateClassName(id);
}

//TANYA TODO: Make it so that the image has a boarder around it since these images are pending
//Add is a boolean, If it is a pending add, it is  true, otherwise it is false
//Given an element id and an image, sets the image src in the innerHTML
function setPendingImage(id, image, add){
    // Set the image
    var b = document.getElementById(id);
    b.innerHTML = '<img class="calendarImage" src="' + image + '">';
    setAppropriateClassName(id);
}

// Given an element id, clear that shift in the innerHTML
function clearShiftImage(id) {
    var image;
    if (id.indexOf("morning") != -1) {
        image = imagePath + "day.png";
    } else if (id.indexOf("evening") != -1) {
        image = imagePath + "evening.png";
    } else if (id.indexOf("night") != -1) {
        image = imagePath + "night.png";
    }
    setShiftImage(id, image);
}

// Given an element id and an image, sets the overlay (absent/excused) image
// src in the innerHTML
function setShiftOverlayImage(id, image) {
    var b = document.getElementById(id);

    // If it already had an overlay image, clear it
    if ((b.innerHTML.indexOf("absent") != -1) || 
        (b.innerHTML.indexOf("excused") != -1)) {
        clearShiftOverlayImage(id);
    }

    b.innerHTML += '<img class="overlayImage" src="' + image + '">';
}

// Given an element id, clears the overlay image
function clearShiftOverlayImage(id) {
    var b = document.getElementById(id);
    var icon = b.innerHTML.substring(0, b.innerHTML.indexOf(">")+1);
    b.innerHTML = icon;
}

// Checks if a shift is even set (i.e. has a discipline)
function hasDiscipline(id) {
    var b = document.getElementById(id);
    return (b.innerHTML.indexOf("day") == -1) &&
           (b.innerHTML.indexOf("evening") == -1) &&
           (b.innerHTML.indexOf("night") == -1)
}

function deleteShift(id){
	console.log("in delete shift");
	var date = id.slice(0,10);
	var time = id.slice(10);
	if(time == "morning"){
		time = "day";
	}
	if(discipline == "Racing"){
		discipline = "Race";
	}
	clearShiftImage(id);
	console.log("middle of delete shift");
	var tempSch = instructorSchedule.slice(0);
	instructorSchedule = instructorSchedule.slice(0,0);
	console.log("after instr sched");
	for(var i=0; i<tempSch.length; i++){
		console.log("in loop");
		if (tempSch[i][1] != date || tempSch[i][2] != time){
			console.log("don't want to delete");
			console.log(tempSch[i]);
			instructorSchedule.push(tempSch[i]);
		}
	}
	console.log("end of delete shift");
}

function addShift(id, status, discipline){
	var date = id.slice(0,10);
	var time = id.slice(10);
	if(time == "morning"){
		console.log("in morning");
		time = "day";
	}
	if(discipline == "Racing"){
		console.log("in racing");
		discipline = "Race";
	}
	console.log(status);
	console.log(time);
	console.log(discipline);
	instructorSchedule.push([status, date, time, discipline])
}

function changeStatus(id, newStatus){
	var date = id.slice(0,10);
	var time = id.slice(10);
	if(time == "morning"){
		time = "day";
	}
	console.log("in change status");
	console.log(time);
	for(var i=0; i<instructorSchedule.length; i++){
		if (instructorSchedule[i][1] == date && instructorSchedule[i][2] == time){
			instructorSchedule[i][0] = newStatus;
			return true;
		}
	}
	return false;
}

function getDisciplineFromImage(imageName){
    if (imageName == "childrenSki"){
    	discipline = "Child Ski";
    }else if(imageName == "childrenSnowboard"){
    	discipline = "Child Board";
    }else if (imageName == "adultSki"){
    	discipline = "Adult Ski";
    }else if (imageName == "adultSnowboard"){
    	discipline = "Adult Board";
    }else if (imageName == "racing"){
    	discipline = "Racing";
    }else{
    	discipline = "INVALID";
    }
    return discipline
}

//Returns the status of the shift. Returns None if it doesn't exist.
function statusOfShift(date, time, discipline){
	console.log("statusOfShift");
	console.log(date);
	console.log(time);
	console.log(discipline);
	var instrDate = date;
	var instrTime = time;
	if(instrTime == "morning"){
		console.log("in day");
		instrTime = "day";
	}
	var instrDiscipline = discipline;
	if (instrDiscipline == "Racing"){
		instrDiscipline = "Race";
	}
	console.log("statusOfShiftEdit");
	console.log(instrDate);
	console.log(instrTime);
	console.log(instrDiscipline);
	for(var i = 0; i < instructorSchedule.length; i++){
		console.log(instructorSchedule[i])
		if (instructorSchedule[i][1] == instrDate && instructorSchedule[i][2] == instrTime && instructorSchedule[i][3] == instrDiscipline){
			console.log("match");
			return instructorSchedule[i][0];
		}
	}
	return "None";
}


// Uses the current cursor to change the image for the shift
function shiftClicked(e) {
    // If the cursor is the eraser, remove the shift
    if (cursorImage.indexOf("eraser.") != -1) {
    	if (isAdmin == "True"){
    		deleteShift(this.id);	
    	}else{
    		console.log("delete");
    		curImage = document.getElementById(this.id).innerHTML;
    		curImage = curImage.substring(32, curImage.indexOf(">"));
    		var date = this.id.slice(0,10).toString();
    		var time = this.id.slice(10).toString();
    		var discipline = getDisciplineFromImage(curImage.substring(15, curImage.indexOf(".png")));
    		console.log("status");
    		console.log(statusOfShift(date, time, discipline));
    		if(statusOfShift(date, time, discipline) == "Pending Add"){
    			console.log("pending add exists");
    			console.log(this.id);
    			deleteShift(this.id);
    			console.log("call pending delete");
    			deletePendingMsg(date, time, discipline);
    			console.log(instructorSchedule);
    		}else if(statusOfShift(date, time, discipline) != "Pending Delete"){
    			console.log("no pending delete exists");
    			console.log(this.id)
    			changeStatus(this.id, "Pending Delete");
	    		clearShiftImage(this.id);
	    		setPendingImage(this.id, curImage, false);
	    		addPendingMsg(["Pending Delete", date, time, discipline])
    		}
	    		
    	}
        
    }

    // If it's excused add that image to the button as an overlay
    else if (cursorImage.indexOf("excused.") != -1) {
        // If there is no discipline set, ignore the button press 
        if (hasDiscipline(this.id)) {
            // Set the overlay image to be excused
        	changeStatus(this.id, "Excused");
            setShiftOverlayImage(this.id, imagePath + "excused.png");
        }
    }

    // If it's absent add that image to the button as an overlay
    else if (cursorImage.indexOf("absent.") != -1) {
        // If there is no discipline set, ignore the button press 
        if (hasDiscipline(this.id)) {

            // Set the overlay image to be absent
        	changeStatus(this.id, "Absent");
            setShiftOverlayImage(this.id, imagePath + "absent.png");
        }
    }

    // Check if we're just clearing the excused label
    else if (cursorImage.indexOf("excuseCancel.") != -1) {
        if (this.innerHTML.indexOf("excused") != -1) {
        	changeStatus(this.id, "Normal");
            clearShiftOverlayImage(this.id);
        }
    }

    // Check if we're just clearing the absent label
    else if (cursorImage.indexOf("absentCancel.") != -1) {
        if (this.innerHTML.indexOf("absent") != -1) {
        	changeStatus(this.id, "Normal");
            clearShiftOverlayImage(this.id);
        }
    }

    // Otherwise, if it's a valid discipline, set the shift icon
    else if (cursorImage != "") {
        var cursorName = cursorImage.substring(0, cursorImage.indexOf("."));
        discipline = getDisciplineFromImage(cursorName.slice(15));

        if(isAdmin == "True"){
        	deleteShift(this.id);
        	addShift(this.id, "Normal", discipline);
        	setShiftImage(this.id, cursorName + ".png");
        }else{
        	console.log("Add Status of shift");
        	console.log(statusOfShift);
    		var date = this.id.slice(0,10).toString();
    		var time = this.id.slice(10).toString();
        	if(statusOfShift(date, time, discipline) == "Pending Delete"){
        		console.log("this has a pending delete");
            	deleteShift(this.id);
            	addShift(this.id, "Normal", discipline);
            	setShiftImage(this.id, cursorName + ".png");
        		var date = this.id.slice(0,10);
        		var time = this.id.slice(10);
            	deletePendingMsg(date, time, discipline);
        	}else if(statusOfShift(date, time, discipline) != "Pending Add"){
            	addShift(this.id, "Pending Add", discipline);
            	setPendingImage(this.id, cursorName + ".png", true);
        		curImage = document.getElementById(this.id).innerHTML;
        		curImage = curImage.substring(32, curImage.indexOf(">"));
        		var date = this.id.slice(0,10);
        		var time = this.id.slice(10);
        		var discipline = getDisciplineFromImage(curImage.substring(15, curImage.indexOf(".png")));
	    		if(time == "morning"){
	    			time = "day";
	    		}
	    		if(discipline == "Racing"){
	    			discipline = "Race";
	    		}
        		addPendingMsg(["Pending Add", date, time, discipline])
        	}

        }
        
    }
}

// It's not pretty, but it works.  I will keep trying to make it more 
// streamlined as I learn more.
function sidebarButtonClicked(e) {
    // Get the image for the button that was pressed to use as the cursor
    otherStyle = imagePath + this.id + ".cur"; // id == the image name

    // Specify the "hot spot" for the cursor (i.e. the center) as the point
    // (32,32) in the image (might not work in IE)
    var cursorStyle = "url(" + otherStyle + ") 15 15, auto";
    cursorImage = otherStyle;

    // If the arrow button was clicked, just clear the cursor instead
    if (this.id == "arrow") { 
        cursorStyle = "auto";
        cursorImage = ""; 
    }

    // Update the body cursor style
    document.body.style.cursor = cursorStyle;

    // Update each button's cursor
    try {
        for (var i = 0; i < sidebarIds.length; i++) {
            document.getElementById(sidebarIds[i]).style.cursor = cursorStyle;
        }
    } catch(err) { } // catch error if not admin

    // Set the cursor style for each of the shift buttons in the calendar
    var yearMonths = ["2012-12", "2013-01", "2013-02", "2013-03"];
    for (var midx = 0; midx < yearMonths.length; midx++) {
        var yearMonth = yearMonths[midx];

        for (var day = 1; day <= 31; day++) {
            var date = yearMonth + "-" + day;
            
            if (day < 10) {
                date = yearMonth + "-0" + day;
            }

            var shifts = ["morning", "evening", "night"];
            for (var sidx = 0; sidx < shifts.length; sidx++) {
                try {
                    var id = date + shifts[sidx];
                    document.getElementById(id).style.cursor = cursorStyle;
                } catch(err) { }
            }
        }
    }
}
