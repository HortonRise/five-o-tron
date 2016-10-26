////////////////////////////////////////////////////////////
// 15Five JS File
///////////////////////////////////////////////////////////////
var started = 0;
var fiveTimer;
var ready = false;
var num = 0;
var testArray;
var currentID;
var colors = [
    "#ff6b0b",
    "#38C6F4",
    "#B9D531",
    "#113a87",
    "#ff6b0b",
    "#38C6F4",
    "#B9D531",
    "#113a87",
    "#ff6b0b",
    "#38C6F4",
    "#B9D531",
    "#113a87"
];

function download() {
    $.ajax({
            dataType: "json",
            method: "GET",
            url: "/highfives",
            data: null
        })
        //When you recieve it, run the JSON through the refresh function to update the browser
        .done(function(results) {
            process(results);
        });
}

function redeem() {
    if (testArray[num].redeemed == 0) {
        $(".redeemedIcon2").removeClass("displayNone");
        $(".redeemedIcon").addClass("displayNone");
        testArray[num].redeemed = 1;
        console.log("Redeeming: " + currentID);
        $.ajax({
                dataType: "json",
                method: "GET",
                url: "/redeem?fiveID=" + currentID,
                data: {}
            })
            .done(function(results) {
                console.log(results);
            });
    } else {
        console.log("not ready");
    }
}

function initialLoad() {
    //This is the intitial function that runs.
    //Request the current liteBrite color grid from lb_json
    download();
    setInterval(function() {
        download();
        console.log("Requested Update");
    }, 60 * 10 * 1000);
}

function process(results) {
    var highFives = [];
    testArray = [];
    //Loop through each of the results an add them to the array
    jQuery.each(results, function(i, val) {
        var newObj = {
            id: val['id'],
            text: val['text'],
            redeemed: val['redeemed'],
            qty: val['qty'],
            creator: "@" + val['first_name'] + val['last_name'],
            recip: "",
            date: val['date']
        };
        testArray.push(newObj);
    });

    if (started == 0) {
        started = 1;
        swapHF();
    }
}

function swapHF() {
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

var changeColors = function(i) {
    setTimeout(function() {
        $(".getReadyText").css("color", colors[i]);
    }, (i + 1) * 200);
}

var startCountdown = function() {
    ready = false;
    clearTimeout(fiveTimer);
    $(".getReady").addClass("hidden");
    $(".countdownTimer").css("transform", "scale(.65)");
    $(".countdownTimer").css("opacity", ".7");
    $(".countdownTimer").css("transition", "all 1.2s");
    $(".countdown").removeClass("hidden");
    downcount(4);
}

var downcount = function(currentNum) {
    currentNum--;

    $(".countdownTimer").html(currentNum);
    $(".countdownTimer").removeClass("hidden");
    $(".countdownTimer").css("transform", "scale(.9)");
    $(".countdownTimer").css("opacity", "1");
    if (currentNum !== 0) {
        setTimeout(function() {
            //$(".countdownTimer").addClass("hidden");
            $(".countdownTimer").css("transition", "all 0s");
            $(".countdownTimer").css("transform", "scale(.65)");
            $(".countdownTimer").css("opacity", ".0");
        }, 1000);
        setTimeout(function() {
            $(".countdownTimer").css("transition", "all 1.2s");
        }, 1050);
        setTimeout(function() {
            //$(".countdownTimer").removeClass("hidden");
            downcount(currentNum);
        }, 1300);
    } else {
        //pick a random sfx to play
        var rand = Math.floor((Math.random() * 5) + 1);
        new Audio('sfx/sfx' + rand + '.mp3').play();
        //change the wording
        prepare("HIGH FIVE!");
        //send the ajax request to trigger the motor
        redeem();

        for (var i = 0; i < colors.length; i++) {
            changeColors(i);
        }
        setTimeout(function() {
            $(".getReady").addClass("hidden");
            $(".countdown").addClass("hidden");
            $(".highfive").removeClass("hidden");
            ready = true;
        }, 2600);
    }
}

var prepare = function(text) {
    $(".countdown").addClass("hidden");
    $(".highfive").addClass("hidden");
    $(".getReady").removeClass("hidden");
    $('.getReadyText').html(text);
}


function fadeIn() {
    setTimeout(function() {
        $(".textWrapper").addClass("scaleUp");
        $(".textWrapper").removeClass("scaleDown");
    }, 200);

    setTimeout(function() {
        $("#triangle-left").removeClass("quickInvisible");
        $("#triangle-left").addClass("quickVisible");
    }, 280);

    setTimeout(function() {
        $("#triangle-left").css("margin-top", "-60px");
        $("#triangle-left").css("margin-left", "80%");
    }, 280);

    setTimeout(function() {
        $(".recipH").removeClass("invisible");
    }, 900);

    setTimeout(function() {
        $("#hfText").removeClass("invisible");
    }, 900);

    setTimeout(function() {
        if (testArray[num].redeemed == "1") {
            $(".redeemedIcon2").removeClass("displayNone");
            $(".redeemedIcon").addClass("displayNone");
        } else {
            $(".redeemedIcon").removeClass("displayNone");
            $(".redeemedIcon2").addClass("displayNone");
        }
    }, 1600);

    setTimeout(function() {
        $(".creatorH").removeClass("invisible");
        $(".redeemedCircle").removeClass("iconScaleDown");
        $(".redeemedCircle").addClass("iconScaleUp");
    }, 900);

    setTimeout(function() {
        $(".date").removeClass("invisible");
        ready = true;
    }, 1000);

}

function fadeOut() {
    ready = false;
    $(".date").addClass("invisible");

    setTimeout(function() {
        $(".creatorH").addClass("invisible");
    }, 100);

    setTimeout(function() {
        $("#hfText").addClass("invisible");
    }, 200);

    setTimeout(function() {
        $("#triangle-left").css("margin-top", "-200px");
        $("#triangle-left").css("margin-left", "60%");
    }, 280);

    setTimeout(function() {
        $("#triangle-left").removeClass("quickVisible");
        $("#triangle-left").addClass("quickInvisible");
    }, 290);

    setTimeout(function() {
        $(".recipH").addClass("invisible");
        $(".redeemedCircle").removeClass("iconScaleUp");
        $(".redeemedCircle").addClass("iconScaleDown");
    }, 300);

    setTimeout(function() {
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
        if (testArray[num].redeemed == "1") {
            $(".redeemedIcon2").removeClass("displayNone");
            $(".redeemedIcon").addClass("displayNone");
        } else {
            $(".redeemedIcon").removeClass("displayNone");
            $(".redeemedIcon2").addClass("displayNone");
        }
        fiveTimer = window.setTimeout(fadeOut, 7900);
    } else {}
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 38) {
        next();
    } else if (key == 40 && ready && testArray[num].redeemed == 0) {
        prepare("GET READY");
        setTimeout(function() {
            startCountdown();
        }, 1200);

        setTimeout(function() {
            fiveTimer = window.setTimeout(fadeOut, 7900);
        }, 11000);
    }
}
