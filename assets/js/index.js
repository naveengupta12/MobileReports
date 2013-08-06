$(document).on('pagebeforeshow', '#login', function(){  
        $(document).on('click', '#submit', function() { // catch the form's submit event
        if($('#username').val().length > 0 && $('#password').val().length > 0){
            // Send data to server through ajax call
            // action is functionality we want to call and outputJSON is our data
                $.ajax({url: 'http://192.168.1.168/mr/content.txt',
                    data: {action : 'login', formData : $('#check-user').serialize()}, // Convert a form to a JSON string representation
                        type: 'post',
                    async: true,
                    crossDomain: true, 
                    beforeSend: function() {
                        // This callback function will trigger before data is sent
                        $.mobile.showPageLoadingMsg(true); // This will show ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
                    },
                    success: function (result) {
                            resultObject.formSubmitionResult = result;
                                        $.mobile.changePage("#second");
                    },
                    error: function (request,error) {
                        // This callback function will trigger on unsuccessful action                
                        alert('Network error has occurred please try again!');
                    }
                });                   
        } else {
            alert('Please fill all nececery fields');
        }           
            return false; // cancel original event to prevent form submitting
        });    
});

$(document).on('pagebeforeshow', '#second', function () {
    $('#second [data-role="content"]').append(resultObject.formSubmitionResult);

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

    updateTables();
    $(window).on("redraw", function () { switched = false; updateTables(); }); // An event to listen for
    $(window).on("resize", updateTables);



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


});

var resultObject = {
    formSubmitionResult : null
}


