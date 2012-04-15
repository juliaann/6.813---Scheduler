// Useful global variables for updating the calendar view via user mouse clicks
var cursorImage = "";
var imagePath = "/static/images/";

// Add the click listener to each sidebar button
$(document).ready(function() {

    var adultSki = document.getElementById('adultSki');
    if (adultSki.addEventListener) {
        adultSki.addEventListener('click', sidebarButtonClicked, false);
    }

    var adultSnow = document.getElementById('adultSnowboard');
    if (adultSnow.addEventListener) {
        adultSnow.addEventListener('click', sidebarButtonClicked, false);
    }

    var childrenSki = document.getElementById('childrenSki');
    if (childrenSki.addEventListener) {
        childrenSki.addEventListener('click', sidebarButtonClicked, false);
    }

    var childrenSnowboard = document.getElementById('childrenSnowboard');
    if (childrenSnowboard.addEventListener) {
        childrenSnowboard.addEventListener('click', sidebarButtonClicked, false);
    }

    var racing = document.getElementById('racing');
    if (racing.addEventListener) {
        racing.addEventListener('click', sidebarButtonClicked, false);
    }

    var removeShift = document.getElementById('removeShift');
    if (removeShift.addEventListener) {
        removeShift.addEventListener('click', sidebarButtonClicked, false);
    }

    var arrow = document.getElementById('arrow');
    if (arrow.addEventListener) {
        arrow.addEventListener('click', sidebarButtonClicked, false);
    }

    // Play with 12/23 morning/evening/night 
    var day = document.getElementById('2012-12-23morning');
    if (day.addEventListener) {
        day.addEventListener('click', shiftClicked, false);
    }
    var evening = document.getElementById('2012-12-23evening');
    if (evening.addEventListener) {
        evening.addEventListener('click', shiftClicked, false);
    }
    var night = document.getElementById('2012-12-23night');
    if (night.addEventListener) {
        night.addEventListener('click', shiftClicked, false);
    }
});

// Given an element id and an image, sets the image src in the innerHTML
function setShiftImage(id, image) {
    var shiftButton = document.getElementById(id);
    shiftButton.innerHTML = '<img class="calendarImage" src="' + image + '">';
}

// Uses the current cursor to change the image for the shift
function shiftClicked(e) {

    // If the cursor is the eraser, remove the shift
    if (cursorImage == imagePath + "eraser.png") {
        if (this.id.indexOf("morning") != -1) {
            var image = imagePath + "day.png";
            setShiftImage(this.id, image);
        } else if (this.id.indexOf("evening") != -1) {
            var image = imagePath + "evening.png";
            setShiftImage(this.id, image);
        } else if (this.id.indexOf("night") != -1) {
            var image = imagePath + "night.png";
            setShiftImage(this.id, image);
        }
    }

    // Otherwise, if it's a valid discipline, set the shift icon
    else if (cursorImage != "") {
        setShiftImage(this.id, cursorImage);
    }
}

// It's not pretty, but it works.  I will keep trying to make it more 
// streamlined as I learn more.
function sidebarButtonClicked(e) {
    // Get the image for the button that was pressed to use as the cursor
    var otherStyle = "";
    if (this.id == "adultSki") {
        otherStyle = imagePath + "adultSki.png";
    } else if (this.id == "adultSnowboard") {
        otherStyle = imagePath + "adultSnowboard.png";
    } else if (this.id == "childrenSki") {
        otherStyle = imagePath + "childrenSki.png";
    } else if (this.id == "childrenSnowboard") {
        otherStyle = imagePath + "childrenSnowboard.png";
    } else if (this.id == "racing") {
        otherStyle = imagePath + "racing.png";
    } else if (this.id == "removeShift") {
        otherStyle = imagePath + "eraser.png";
    }
    // Specify the "hot spot" for the cursor (i.e. the center) as the point
    // (32,32) in the image (might not work in IE)
    var cursorStyle = "url(" + otherStyle + ") 32 32, auto";
    cursorImage = otherStyle;

    // If the arrow button was clicked, just clear the cursor instead
    if (this.id == "arrow") { 
        cursorStyle = "auto";
        cursorImage = ""; }

    // Update the body cursor style
    document.body.style.cursor = cursorStyle;

    // Update each button's cursor
    document.getElementById("adultSki").style.cursor = cursorStyle;
    document.getElementById("adultSnowboard").style.cursor = cursorStyle;
    document.getElementById("childrenSki").style.cursor = cursorStyle;
    document.getElementById("childrenSnowboard").style.cursor = cursorStyle;
    document.getElementById("racing").style.cursor = cursorStyle;     
    document.getElementById("removeShift").style.cursor = cursorStyle;
    document.getElementById("arrow").style.cursor = cursorStyle;

    // December
    var month = 12;
    for (var day = 1; day <= 31; day++) {
        var date = "2012-" + month + "-" + day;
        if (day < 10) {
            date = "2012-" + month + "-0" + day;
        }
        
        // Morning
        try {  
            document.getElementById(date + "morning").style.cursor = cursorStyle;
        } catch(err) { }
     
        // Evening
        try {
            document.getElementById(date + "evening").style.cursor = cursorStyle;
        } catch(err) { }

        // Night
        try {
            document.getElementById(date + "night").style.cursor = cursorStyle;
        } catch(err) { }  
    }
 
    // January - March
    for (var month = 1; month <= 3; month++) {
        for (var day = 1; day <= 31; day++) {
            var date = "2013-0" + month + "-" + day;
            if (day < 10) {
                date = "2013-0" + month + "-0" + day;
            }
        
            // Morning
            try {  
                document.getElementById(date + "morning").style.cursor = cursorStyle;
            } catch(err) { }
         
            // Evening
            try {
                document.getElementById(date + "evening").style.cursor = cursorStyle;
            } catch(err) { }

            // Night
            try {
                document.getElementById(date + "night").style.cursor = cursorStyle;
            } catch(err) { }  
        }
    }
}
