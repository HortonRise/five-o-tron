////////////////////////////////////////////////////////////
// 15Five JS File
///////////////////////////////////////////////////////////////
var started = 0;
var fiveTimer;
var ready = false;
var num = 0;
var testArray;
var currentID;

function download() {
  $.ajax({
          dataType: "json",
          method: "GET",
          url: "/highfives",
          data: null
      })
      //When you recieve it, run the JSON through the refresh function to update the browser
      .done(function(results) {
          //console.log(msg);
          //console.log(results);
          //display(results);
          process(results);

      });
}

function redeem() {
   if (ready && testArray[num].redeemed == 0) {
	$(".redeemedIcon2").removeClass("displayNone");
	$(".redeemedIcon").addClass("displayNone");
	testArray[num].redeemed = 1;
	console.log("Redeeming: " + currentID);
	  $.ajax({
	          dataType: "json",
	          method: "GET",
	          url: "/redeem?fiveID="+currentID,
	          data: {}
	      })
	      .done(function(results) {
	          console.log(results);
     	 });
    }

}

function initialLoad() {
    //This is the intitial function that runs.
    //Request the current liteBrite color grid from lb_json
    download();
    setInterval(function(){
      download();
      console.log("Requested Update");
    }, 60 * 10 * 1000);
}


function display(results) {
    //lights is a json array of the individual rows and columns
    //each object in the data set has a row, col, and r/g/b value
    jQuery.each(results, function(i, val) {
        var text = val['text'];
        var redeemed = val['redeemed'];
        var qty = val['qty'];
        var creator = "@" + val['first_name']+ val['last_name'];
        var date = val['date'];
        //console.log(text);
    });
}

function process(results) {

    var highFives = [];
    //console.log(results);

    testArray = [];


    var cx = ["@AnthonyAffinati", "@AmandaNyren", "@AlexArkoosh", "@AmelieProvosty", "@MikeGreen", "@KatelynMuenck", "@JeanZhang", "@JonathanLarson", "@JohnHorton", "@WillWatkins", "@StevenChen","@KyleBuckley", "@VanessaLacy","@ClairLoewy","@LouAmodeo"];

    jQuery.each(results, function(i, val) {
        //console.log(this);
        var newObj = {id:"", text:"", redeemed:"", qty:"", creator:"", recip:"", date:""};
        var text = val['text'];
	var id = val['id'];
        var redeemed = val['redeemed'];
        var qty = val['qty'];
        var creator = "@" + val['first_name']+ val['last_name'];
        var date = val['date'];

        //console.log(creator);
        var hfText = text;
        //console.log(hfText);
        var textLength = hfText.length;
        var nameBool = false;
        var currentName = "";
        for(var j=0; j<textLength; j++){
            // console.log(hfText[j] + " " + nameBool)
            if(hfText[j]=="@"){
                nameBool = true;
                currentName = currentName + hfText[j];
                //console.log("@");
            }else if (nameBool && hfText[j]!="<"){
                currentName = currentName + hfText[j];
                //console.log(currentName);
            //}else if (nameBool && hfText[j]=="<" || hfText[j]=="," || hfText[j]==" "){
            }else if (nameBool && hfText[j]=="<"){
                // console.log(hfText[j] + " " + nameBool)
                // console.log("< FOUND");
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
                            newObj.date = date;
			    newObj.id = id;
                            testArray.push(newObj);
                        }
                    }
                }
                nameBool = false;
                currentName = "";
            }

        };

    });

    if (started == 0) {
      started = 1;
      swapHF();
    }
}

function swapHF(){
	ready = false;
        displayNext();
        fadeIn();
	fiveTimer = window.setTimeout(fadeOut, 7900);
}

function displayNext() {
	num = (num + 1) % testArray.length;
        $(".recipH").html(testArray[num].recip);
        $("#hfText").html(testArray[num].text);
        $(".creatorH").html(testArray[num].creator);
        $(".date").html(testArray[num].date);
	currentID = testArray[num].id;
}


function fadeIn() {
	setTimeout(function(){
            $(".textWrapper").addClass("scaleUp");
            $(".textWrapper").removeClass("scaleDown");
        }, 200);

        setTimeout(function(){
            $("#triangle-left").removeClass("quickInvisible");
            $("#triangle-left").addClass("quickVisible");
        }, 280);

        setTimeout(function(){
            $("#triangle-left").css("margin-top","-60px");
            $("#triangle-left").css("margin-left","80%");
        },280);

        setTimeout(function(){
            $(".recipH").removeClass("invisible");
        }, 900);

        setTimeout(function(){
            $("#hfText").removeClass("invisible");
        }, 900);

        setTimeout(function(){
            if(testArray[num].redeemed == "1"){
                $(".redeemedIcon2").removeClass("displayNone");
                $(".redeemedIcon").addClass("displayNone");
            } else {
		$(".redeemedIcon").removeClass("displayNone");
                $(".redeemedIcon2").addClass("displayNone");
	    }
        }, 1600);

        setTimeout(function(){
            $(".creatorH").removeClass("invisible");
            $(".redeemedCircle").removeClass("iconScaleDown");
            $(".redeemedCircle").addClass("iconScaleUp");
        }, 900);

        setTimeout(function(){
            $(".date").removeClass("invisible");
		ready = true;
        }, 1000);
	
}

function fadeOut() {
	ready = false;
        $(".date").addClass("invisible");

        setTimeout(function(){
            $(".creatorH").addClass("invisible");
        }, 100);

        setTimeout(function(){
            $("#hfText").addClass("invisible");
        }, 200);
	
	setTimeout(function(){
            $("#triangle-left").css("margin-top","-200px");
            $("#triangle-left").css("margin-left","60%");
        },280);

        setTimeout(function(){
            $("#triangle-left").removeClass("quickVisible");
            $("#triangle-left").addClass("quickInvisible");
        }, 290);

        setTimeout(function(){
            $(".recipH").addClass("invisible");
            $(".redeemedCircle").removeClass("iconScaleUp");
            $(".redeemedCircle").addClass("iconScaleDown");
        }, 300);

	setTimeout(function(){
            $(".textWrapper").addClass("scaleDown");
            $(".textWrapper").removeClass("scaleUp");
        }, 600);

	setTimeout(function() {
		swapHF();
	}, 2000);
}

function next() {
	if (ready) {
		clearTimeout(fiveTimer);
		displayNext();
		if(testArray[num].redeemed == "1"){
	                $(".redeemedIcon2").removeClass("displayNone");
	                $(".redeemedIcon").addClass("displayNone");
	            } else {
			$(".redeemedIcon").removeClass("displayNone");
	                $(".redeemedIcon2").addClass("displayNone");
	    	}
		fiveTimer = window.setTimeout(fadeOut, 7900);
	} else {
	}
}

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   if (key == 38) {
       next();
   }else if (key == 40) {
       redeem();
   }
}
