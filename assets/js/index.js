document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    document.addEventListener("backbutton", function (e) { 
            e.preventDefault();
            navigator.app.exitApp();
        }, false);
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true;
       
    }

    $(document).on('click', '#submit', function () { // catch the form's submit event
        if ($('#username').val().length > 0 && $('#password').val().length > 0) {
            // Send data to server through ajax call
            // action is functionality we want to call and outputJSON is our data
            var email = $('#username').val();
            var pwd = $('#password').val();
            if ($('#remember').is(':checked')) {
                window.localStorage.setItem("username", email);
                window.localStorage.setItem("password", pwd);
            } else {
                window.localStorage.clear();
            }

            $.ajax({ url: 'http://182.74.37.76/OEGReports/Classes/DGRReport.ashx',
                data: { username: email, password: pwd }, // Convert a form to a JSON string representation
                dataType: 'text',
                type: 'POST',
                async: true,
                cache: false,
                crossDomain: true,
                timeout: 10000,
                beforeSend: function () {
                    // This callback function will trigger before data is sent
                    
                    $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                },
                complete: function () {
                    // This callback function will trigger on data sent/received complete
                    
                    $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                },
                success: function (data, textStatus, request) {
                    if (data.indexOf('responsive') != -1) {
                        resultObject.formSubmitionResult = data;
                        $.mobile.changePage("#second");

                    } else {
                        alert("Username/Password is not valid!!");

                    }

                },
                error: function (request, error) {
                     // This callback function will trigger on unsuccessful action                
                   //alert('Network error has occurred please try again!, readyState:' + request.readyState + " status:" + request.status + " statusText:" + request.statusText + " response:" + request.responseText);
                    alert("Network error has occurred please try again!");

                  }
            });
        } else {
            alert('Please enter Username & Password.');
        }
        return false; // cancel original event to prevent form submitting
    });
$(document).on('pagebeforeshow', '#login', function () {
    if (window.localStorage.getItem("username")) {
        $('#username').val(window.localStorage.getItem("username"));
        $('#password').val(window.localStorage.getItem("password"));
        $("input[type='checkbox']").attr("checked", true).checkboxradio("refresh");
    }
    
});



var resultObject = {
    formSubmitionResult : null
}


var switched = false;
var updateTables = function () {
    if (($(window).width() < 767) && !switched) {
        switched = true;
        $("table.responsive").each(function (i, element) {
            splitTable($(element));
        });
        return true;
    }
    else if (switched && ($(window).width() > 767)) {
        switched = false;
        $("table.responsive").each(function (i, element) {
            unsplitTable($(element));
        });
    }
};


function splitTable(original) {
    original.wrap("<div class='table-wrapper' />");

    var copy = original.clone();
    copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
    copy.removeClass("responsive");

    original.closest(".table-wrapper").append(copy);
    copy.wrap("<div class='pinned' />");
    original.wrap("<div class='scrollable' />");

    setCellHeights(original, copy);
}

function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
}

function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
        var self = $(this),
          tx = self.find('th, td');

        tx.each(function () {
            var height = $(this).outerHeight(true);
            heights[index] = heights[index] || 0;
            if (height > heights[index]) heights[index] = height;
        });

    });

    tr_copy.each(function (index) {
        $(this).height(heights[index]);
    });
}

$(document).on('pagebeforeshow', '#second', function () {
    $('#second [data-role="content"]').html(resultObject.formSubmitionResult);
    switched = false;
    updateTables();
    //$(window).on("redraw", function () { switched = false; updateTables(); }); // An event to listen for
    //$(window).on("resize", updateTables);


});