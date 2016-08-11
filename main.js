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
            console.log(results);

        });
}

function display(results) {
    //lights is a json array of the individual rows and columns
    //each object in the data set has a row, col, and r/g/b value
    jQuery.each(results, function(i, val) {
        var text = val['text'];
        var redeemed = val['redeemed'];
        var qty = val['qty'];
        var creator = "@" + val['first_name']+ val['last_name'];
        console.log(text);
    });
}




$( document ).ready(function() {

    var highFives = [];

    function getJSON() {
        console.log("Poop");
        var inner = $(".test").html();
        $(".test").html("");
        var parsed = JSON.parse(inner);
        parsed = JSON.parse(parsed);
        console.log(parsed);


        var count = parsed.count;
        //console.log(count);
        var results = parsed.results;
        //console.log(results);
        var cx = ["@AnthonyAffinati", "@AmandaNyren", "@AlexArkoosh", "@AmelieProvosty", "@MikeGreen", "@KatelynMuenck", "@JeanZhang", "@JonathanLarson", "@JohnHorton", "@WillWatkins", "@StevenChen","@KyleBuckley", "@VanessaLacy","@ClairLoewy","@LouAmodeo"];

        if(count>50){
            count=50;
        }

        for(var i=(count-1); i>=0 ; i--){
            //console.log(i);
            var hfText = results[i].text;
            //console.log(hfText);
            var textLength = hfText.length;
            var nameBool = false;
            var currentName = "";
            for(var j=0; j<textLength; j++){

                if(hfText[j]=="@"){
                    nameBool = true;
                    currentName = currentName + hfText[j];
                    //console.log("@");
                }else if (nameBool && hfText[j]!=" "){
                    currentName = currentName + hfText[j];
                    //console.log(hfText[j]);
                }else if (nameBool && hfText[j]==" " || hfText[j]==","){
                    var cxLength = cx.length;
                    for (var h=0; h<cxLength; h++){
                        if(currentName==cx[h]){
                            //console.log(hfText);
                            highFives.push(hfText);
                        }
                    }
                    nameBool = false;
                    currentName = "";
                    //^Currently prints out each time a name is recognized. Eventually we will need
                    // to only print once but allow for three physical high fives to be doled out
                }

            };

        };
    };

    getJSON();
    //console.log(highFives);

    var num = 0;

    function cycleHF(){
        $("#swap").html(highFives[num]);
        window.setInterval(function () {
            // increase by num 1, reset to 0 at 4
            num = (num + 1) % highFives.length;
            $("#swap").html(highFives[num]);
            //console.log(num);
        }, 2500);
    };

    cycleHF();


});
