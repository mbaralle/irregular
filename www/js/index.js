var verbsGlobal;
var actualVerb;

var adUnit = "ca-app-pub-5978610397346153/5966821227";
var adUnitFullScreen = "ca-app-pub-5978610397346153/7443554423";
var isOverlap = true; //true: overlap, false: split
var isTest = true;

document.addEventListener("deviceready", function(){
            alert('Começou');
            window.admob.setUp(adUnit, adUnitFullScreen, isOverlap, isTest);

            //banner ad callback
            window.admob.onBannerAdPreloaded = function() {
                alert('onBannerAdPreloaded');
                window.admob.showBannerAd('bottom-center', 'SMART_BANNER');
            };
            window.admob.onBannerAdLoaded = function() {
                alert('onBannerAdLoaded');
            };
            //full screen ad callback
            window.admob.onFullScreenAdPreloaded = function() {
                alert('onFullScreenAdPreloaded');
            };
            window.admob.onFullScreenAdLoaded = function() {
                alert('onFullScreenAdLoaded');
            };
            window.admob.onFullScreenAdShown = function() {
                alert('onFullScreenAdShown');
            };
            window.admob.onFullScreenAdHidden = function() {
                alert('onFullScreenAdHidden');
            };
            
            window.admob.preloadBannerAd();
           
}, false);

var myScroll;

function loaded () {
    myScroll = new IScroll('#wrapper', { mouseWheel: true, disableTouch: false, click: true});  

    console.log("loaded");
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function geraVerbs(verbs) {
    verbsGlobal = verbs;
}

function getVerb() {
     var count = verbsGlobal.length;
    
    if (count > 0) {
        var i = randomIntFromInterval(1, count);

        actualVerb = verbsGlobal[i - 1];

        return verbsGlobal[i - 1];
    }
}

$(function() {

    function onBotaoGerarClick() {
        var verb = getVerb();

        $("#irregular-verb").text(verb.normal);
        $("#past-verb").text(verb.past);
        $("#past-participle").text(verb.participle);    


        var owl = $("#owl-demo").data('owlCarousel');
        owl.goTo(0)   
    }

    function addVerbList() {

        $("#list-irregular-verbs").empty();

        for (var i = 0; i < verbsGlobal.length; i++) {
            $("#list-irregular-verbs").append("<li class='item-list' value='"  + i + "''><a href='#item-verb'>" + verbsGlobal[i].normal + "</a></li>");            
        };

        
        $(".item-list").unbind("click");   

        $(".item-list").click(function() {
            console.log($( this ).val());

            var i = $(this).val();

            actualVerb = verbsGlobal[i];

            $("#actual-irregular-verb").text(actualVerb.normal);
            $("#actual-past-verb").text(actualVerb.past);
            $("#actual-past-participle").text(actualVerb.participle);    

            var owl = $("#owl-actual-verbs").data('owlCarousel');
            owl.goTo(0)   

           //  myScroll = new IScroll('#wrapper', { mouseWheel: true, disableTouch: false, click: true});  
        })
    }

    var resposta = 0;
    var past = "";
    var participle = "";
    var pontos = 0;

    function onPageGameShow() {
        var verb = getVerb();

        resposta = 0;

        $("#game-irregular-verb").text(verb.normal);

        $("#div-game-participle").hide();
        $("#answer-past").val("");
        $("#answer-participle").val("");
        $("#div-game-past").show();

        $("#message-game").text("");

        $("#label-option1").text(verb.past);
        $("#label-option2").text(verb.participle);

        $("#msg-verb").text("Verb: " + verb.normal);
        $("#msg-past").text(verb.past);
        $("#msg-participle").text(verb.participle);
    }

    function onBotaEnviarClick() {      
        var pontosGanhos = 0;

        if (resposta === 0) {
            resposta++;

            $("#div-game-past").hide();
            $("#div-game-participle").show();

            past = $("#answer-past").val();
        }
        else {
            resposta = 0;
            participle = $("#answer-participle").val();
        }

        $("#msg-answer-pass").text(past);
        $("#msg-answer-participle").text(participle);


        if (past.toLowerCase() === actualVerb.past) 
        {
            $("#msg-answer-pass").css("color", "blue");
            pontosGanhos += 5;
        }
        else 
            $("#msg-answer-pass").css("color", "red");

        if (participle.toLowerCase() === actualVerb.participle) 
        {
            $("#msg-answer-participle").css("color", "blue");
            pontosGanhos += 5;
        }
        else 
            $("#msg-answer-participle").css("color", "red");

        $("#pontos-ganhos").text("Pontos: +" + pontosGanhos);

        pontos += pontosGanhos;

        $("#pontos-total").text("Pontos: " + pontos);

    }

    function onMyPopupDialogClose() {
        onPageGameShow();
    }

    function onMyFilterKeyUp() {
        myScroll.scrollTo(0, 0);
    }

    $(document).on("pageshow","#game", onPageGameShow);
    $(document).on("pageshow", "#main", onBotaoGerarClick);
    //$(document).on("pageshow","#item-verb", addVerbList);
    $("#botao-gerar").click(onBotaoGerarClick);
    $(".botao-enviar").click(onBotaEnviarClick);    
    $("#myFilter").keyup(onMyFilterKeyUp);

    $("#myPopupDialog").bind({popupafterclose : onMyPopupDialogClose });
    

    $("#owl-demo").owlCarousel({
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true 
    });

    $("#owl-actual-verbs").owlCarousel({
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true 
    });    

    onBotaoGerarClick();

     addVerbList();
})