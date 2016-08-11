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
            //display(results);
            process(results);

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
        //console.log(text);
    });
}




function process(results) {

    var highFives = [];
    //console.log(results);

    var testArray = [];


    var cx = ["@AnthonyAffinati", "@AmandaNyren", "@AlexArkoosh", "@AmelieProvosty", "@MikeGreen", "@KatelynMuenck", "@JeanZhang", "@JonathanLarson", "@JohnHorton", "@WillWatkins", "@StevenChen","@KyleBuckley", "@VanessaLacy","@ClairLoewy","@LouAmodeo"];

    jQuery.each(results, function(i, val) {
        //console.log(this);
        var newObj = {text:"", redeemed:"", qty:"", creator:"", recip:""};
        var text = val['text'];
        var redeemed = val['redeemed'];
        var qty = val['qty'];
        var creator = "@" + val['first_name']+ val['last_name'];

        //console.log(creator);
        var hfText = text;
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
                        //highFives.push(hfText);
                        highFives.push(this);

                        var mostRecent;
                        if(testArray.length>0){
                            mostRecent = testArray[(testArray.length - 1)].text;
                        }else{
                            //mostRecent = 0;
                        }
                        if(text == mostRecent){
                            var incQty = Number(newObj.qty);
                            incQty = incQty + 1;
                            newObj.qty = incQty;

                            newObj.recip = newObj.recip + "  " + currentName;


                            //console.log(newObj.qty);
                        }else{
                            newObj.text= text;
                            newObj.redeemed = redeemed;
                            newObj.qty = qty;
                            newObj.creator = creator;
                            newObj.recip = currentName;

                            testArray.push(newObj);
                        }


                    }
                }
                nameBool = false;
                currentName = "";
            }

        };

    });

    var num = 0;

    function cycleHF(){
        $(".recipH").html(testArray[num].recip);

        $("#hfText").html(highFives[num].text);

        $(".creatorH").html(testArray[num].creator);
        console.log(testArray);
        window.setInterval(function () {
            // increase by num 1, reset to 0 at 4
            num = (num + 1) % testArray.length;

            $(".recipH").html(testArray[num].recip);

            $("#hfText").html(testArray[num].text);

            $(".creatorH").html(testArray[num].creator);
            //console.log(num);
        }, 4000);
    };

    cycleHF();


}
