

$( document ).ready(function() {

    var highFives = [];

    function getJSON() {
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
