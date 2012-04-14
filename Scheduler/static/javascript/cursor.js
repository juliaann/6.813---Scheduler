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
});

// It's not pretty, but it works.  I will keep trying to make it more 
// streamlined as I learn more.
function sidebarButtonClicked(e) {
    // Get the image for the button that was pressed to use as the cursor
    var otherStyle = "";
    if (this.id == "adultSki") {
        otherStyle = "/static/images/adultSki.png";
    } else if (this.id == "adultSnowboard") {
        otherStyle = "/static/images/adultSnowboard.png";
    } else if (this.id == "childrenSki") {
        otherStyle = "/static/images/childrenSki.png";
    } else if (this.id == "childrenSnowboard") {
        otherStyle = "/static/images/childrenSnowboard.png";
    } else if (this.id == "racing") {
        otherStyle = "/static/images/racing.png";
    } else if (this.id == "removeShift") {
        otherStyle = "/static/images/eraser.png";
    }
    var cursorStyle = "url(" + otherStyle + "), auto";

    // If the arrow button was clicked, just clear the cursor instead
    if (this.id == "arrow") { cursorStyle = "auto"; }

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
