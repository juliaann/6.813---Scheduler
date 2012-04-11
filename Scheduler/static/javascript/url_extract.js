 : function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(
                    window.location.href.indexOf('?') + 1).split('&');
            for ( var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar : function(name) {
            return $.getUrlVars()[name];
        }
    });

    // This allows the Javascript code inside this block to only run when the page
    // has finished loading in the browser.
    $(document).ready(function() {

/*        if ($.getUrlVar('size') && $.getUrlVar('size') >= 6) {
            board = new Board($.getUrlVar('size'));
        } else {
            board = new Board(DEFAULT_BOARD_SIZE);
        }
*/
        // Make the row of days of the week
        $('.month').after('<tr><td>Sunday</td><td>Monday</td><td>Tuesday</td><td>Wednesday</td><td>Thursday</td><td>Friday</td><td>Saturday</td></tr>');

        // For now, add five blank rows for days in December
        for (var i = 0; i < 5; i++) {
            $('#december').after('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }

        // NOTE -- this dynamic row creation is not working as expected!  For now, December is entirely hard-coded :(


    });

