////////////////////////////////////////////////////////////
// 15Five JS File
///////////////////////////////////////////////////////////////


function initialLoad() {
    //This is the intitial function that runs.
    //Request the current liteBrite color grid from lb_json
    $.ajax({
            dataType: "json",
            method: "POST",
            url: "15Five.php",
            data: null
        })
        //When you recieve it, run the JSON through the refresh function to update the browser
        .done(function(results) {
            //console.log(msg);
            display(results);

        });
}

function display(results) {
    //lights is a json array of the individual rows and columns
    //each object in the data set has a row, col, and r/g/b value
    jQuery.each(results, function(i, val) {
        var text = val['text'];
        console.log(text);
    });
}
