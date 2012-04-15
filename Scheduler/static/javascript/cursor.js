// Useful global variables for updating the calendar view via user mouse clicks
var cursorImage = "";
var imagePath = "/static/images/";

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

// Add the click listener to each sidebar button
$(document).ready(function() {

    addSidebarClickListener('adultSki');
    addSidebarClickListener('adultSnowboard');
    addSidebarClickListener('childrenSki');
    addSidebarClickListener('childrenSnowboard');
    addSidebarClickListener('racing');

    addSidebarClickListener('removeShift');
    addSidebarClickListener('arrow');
  
    try {
        addSidebarClickListener('excused');
        addSidebarClickListener('absent');
        addSidebarClickListener('excuseCancel');
        addSidebarClickListener('absentCancel'); 
    } catch (err) { }

    // Add click listeners to the shift button -- will clean up later
    // December
    var month = 12;
    for (var day = 1; day <= 31; day++) {
        var date = "2012-" + month + "-" + day;

        if (day < 10) {
            date = "2012-" + month + "-0" + day;
        }
        
        // Morning
        try {  
            addShiftClickListener(date + "morning");
        } catch(err) { }
     
        // Evening
        try {
            addShiftClickListener(date + "evening");
        } catch(err) { }

        // Night
        try {
            addShiftClickListener(date + "night");
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
                addShiftClickListener(date + "morning");
            } catch(err) { }
         
            // Evening
            try {
                addShiftClickListener(date + "evening");
            } catch(err) { }

            // Night
            try {
                addShiftClickListener(date + "night");
            } catch(err) { }  
        }
    } 
});

// Given an element id and an image, sets the image src in the innerHTML
function setShiftImage(id, image) {
    // Set the image
    var b = document.getElementById(id);
    b.innerHTML = '<img class="calendarImage" src="' + image + '">';

    // Change the button class to get the background color
    if (b.id.indexOf("morning") != -1) {
        b.className = "dayButton";
    } else if (b.id.indexOf("evening") != -1) {
        b.className = "eveningButton";
    } else if (b.id.indexOf("night") != -1) {
        b.className = "nightButton";
    }
}

// Given an element id and an image, sets the overlay (absent/excused) image
// src in the innerHTML
function setShiftOverlayImage(id, image) {
    var b = document.getElementById(id);

    // If it already had an overlap image, replace it
    if ((b.innerHTML.indexOf("absent") != -1) || 
        (b.innerHTML.indexOf("excused") != -1)) {
        var icon = b.innerHTML.substring(0, b.innerHTML.indexOf(">")+1);
        b.innerHTML = icon + '<img class="overlayImage" src="' + image + '">';
    }

    // Otherwise, just add the excused image to it
    else {
       b.innerHTML += '<img class="overlayImage" src="' + image + '">';
    }
}

// Uses the current cursor to change the image for the shift
function shiftClicked(e) {

    // If the cursor is the eraser, remove the shift
    if (cursorImage.indexOf("eraser.") != -1) {
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
        this.className = "defaultButton";
    }

    // If it's excused add that image to the button as an overlay
    else if (cursorImage.indexOf("excused.") != -1) {
        // If there is no discipline set, ignore the button press
        if ((this.innerHTML.indexOf("day") == -1) &&
            (this.innerHTML.indexOf("evening") == -1) &&
            (this.innerHTML.indexOf("night") == -1)) {
            
            // Set the overlay image to be excused
            setShiftOverlayImage(this.id, imagePath + "excused.png");
        }
    }

    // If it's absent add that image to the button as an overlay
    else if (cursorImage.indexOf("absent.") != -1) {
        // If there is no discipline set, ignore the button press
        if ((this.innerHTML.indexOf("day") == -1) &&
            (this.innerHTML.indexOf("evening") == -1) &&
            (this.innerHTML.indexOf("night") == -1)) {

            // Set the overlay image to be absent
            setShiftOverlayImage(this.id, imagePath + "absent.png");
        }
    }

    // Check if we're just clearing the excused label
    else if (cursorImage.indexOf("excuseCancel.") != -1) {
        if (this.innerHTML.indexOf("excused") != -1) {
            var icon = this.innerHTML.substring(0, this.innerHTML.indexOf(">")+1);
            this.innerHTML = icon;
        }
    }

    // Check if we're just clearing the absent label
    else if (cursorImage.indexOf("absentCancel.") != -1) {
        if (this.innerHTML.indexOf("absent") != -1) {
            var icon = this.innerHTML.substring(0, this.innerHTML.indexOf(">")+1);
            this.innerHTML = icon;
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
    } else if (this.id == "excused") {
        otherStyle = imagePath + "excused.png";
    } else if (this.id == "absent") {
        otherStyle = imagePath + "absent.png";
    } else if (this.id == "excuseCancel") {
        otherStyle = imagePath + "excuseCancel.png";
    } else if (this.id == "absentCancel") {
        otherStyle = imagePath + "absentCancel.png";
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
    try {
        document.getElementById("excused").style.cursor = cursorStyle;
        document.getElementById("absent").style.cursor = cursorStyle;
        document.getElementById("excuseCancel").style.cursor = cursorStyle;
        document.getElementById("absentCancel").style.cursor = cursorStyle;
    } catch (err) { }

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
                var id = date + "morning";
                document.getElementById(id).style.cursor = cursorStyle;
            } catch(err) { }
         
            // Evening
            try {
                var id = date + "evening";
                document.getElementById(id).style.cursor = cursorStyle;
            } catch(err) { }

            // Night
            try {
                var id = date + "night";
                document.getElementById(id).style.cursor = cursorStyle;
            } catch(err) { }  
        }
    }
}
