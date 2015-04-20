var verbsGlobal;
var actualVerb;

var adUnit = "ca-app-pub-5978610397346153/5358045629";
var adUnitFullScreen = "ca-app-pub-5978610397346153/8054160024";
var isOverlap = true; //true: overlap, false: split
var isTest = true;
var adPreLoaded = false;

document.addEventListener("deviceready", function(){

            window.admob.setUp(adUnit, adUnitFullScreen, isOverlap, isTest);

            //banner ad callback
            window.admob.onBannerAdPreloaded = function() {
                window.admob.showBannerAd('bottom-center', 'SMART_BANNER');
            };

            // window.admob.onBannerAdLoaded = function() {
            //     alert('onBannerAdLoaded');
            // };
            // //full screen ad callback
            window.admob.onFullScreenAdPreloaded = function() {
                 adPreLoaded = true;
            };
            //  window.admob.onFullScreenAdLoaded = function() {
            //
            //  };
            //  window.admob.onFullScreenAdShown = function() {
            //      alert('onFullScreenAdShown');
            //  };
              window.admob.onFullScreenAdHidden = function() {
                  adPreLoaded = false;
                  window.admob.preloadFullScreenAd();
              };

            window.admob.preloadBannerAd();
            window.admob.preloadFullScreenAd();

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
    var verbsGameGlobal = [];
    var chanceGlobal = 5;
    var chanceTotalGlobal = 5;

    function updateStatusBar() {
        $("#total-verbs").text("Verbs: " + verbsGameGlobal.length + "/" + verbsGlobal.length);
        $("#chances").text("Lifes: " + chanceGlobal + "/" + chanceTotalGlobal);
        $("#pontos-total").text("Points: " + pontos);
    }

    function getGameVerb() {
        var verb = getVerb();

        while (verbsGameGlobal.indexOf(verb.normal) >= 0) {
            verb = getVerb();
        }

        verbsGameGlobal.push(verb.normal);

        return verb;
    }

    function onPageGameShow() {
        var verb = getGameVerb();

        resposta = 0;

        $("#game-irregular-verb").text(verb.normal);

        $("#div-game-participle").hide();
        $("#answer-past").val("");
        $("#answer-participle").val("");
        $("#div-game-past").show();


        $("#msg-verb").text("Verb: " + verb.normal);
        $("#msg-past").text(verb.past);
        $("#msg-participle").text(verb.participle);

        updateStatusBar();
    }

    function finalizeGame() {
      $("#msg-points").text(pontos);
      $("#msg-verbs-seen").text(verbsGameGlobal.length + "/" + verbsGlobal.length);
      $.mobile.changePage("#lose-page", {transition: "flip"});
    }

    function onBotaEnviarClick() {
        var verb;
        var answer;

        $("#answer-past").bind();
        $("#game-div-verb").focus();


        if (resposta === 0) {
            verb = actualVerb.past;
            answer = $("#answer-past").val();
        }
        else {
            verb = actualVerb.participle;
            answer = $("#answer-participle").val();
        }

        if (verb === answer)
            $("#popupRight").popup("open", {positionTo: "window", transition:"flip"});
        else {
          chanceGlobal--;
          $("#answer-chance").text("Lifes: " + chanceGlobal + "/" + chanceTotalGlobal);
          $("#popupWrong").popup("open", {positionTo: "window", transition:"flip"});
        }

        if (chanceGlobal === 0) {
          finalizeGame();
        }
    }

    function onMyPopupDialogClose() {
        var pontosGanhos = 0;

        if (resposta === 0) {
            resposta++;

            $("#div-game-past").hide();
            $("#div-game-participle").show();

            past = $("#answer-past").val();

            if (past.toLowerCase() === actualVerb.past)
            {
                $("#msg-answer-pass").css("color", "blue");
                $("#img-past").attr("src", "img/verification.png");
                pontosGanhos += 5;
            }
            else {
                $("#msg-answer-pass").css("color", "red");
                $("#img-past").attr("src", "img/cross.png");
            }
        }
        else {
            resposta = 0;
            participle = $("#answer-participle").val();
            $.mobile.changePage("#answer", {transition: "flip"});

            if (participle.toLowerCase() === actualVerb.participle)
            {
                $("#msg-answer-participle").css("color", "blue");
                $("#img-participle").attr("src", "img/verification.png");
                pontosGanhos += 5;
            }
            else {
                $("#msg-answer-participle").css("color", "red");
                $("#img-participle").attr("src", "img/cross.png");
            }


        }

        $("#msg-answer-pass").text(past);
        $("#msg-answer-participle").text(participle);

        pontos += pontosGanhos;

        updateStatusBar();
    }

    function iniciarGame() {
      pontos = 0;
      verbsGameGlobal = [];
      chanceGlobal = 5;
    }

    function onMenuItemClick() {
      iniciarGame();

      updateStatusBar();
    }

    function onMyFilterKeyUp() {
        myScroll.scrollTo(0, 0);
    }

    function onBotaoReloadClick() {
      if (adPreLoaded) {
        window.admob.showFullScreenAd();
      }

      iniciarGame();
      $.mobile.changePage("#game", {transition: "flip"});
    }

    $(document).on("pageshow","#game", onPageGameShow);
    $(document).on("pageshow", "#main", onBotaoGerarClick);
    $("#botao-gerar").click(onBotaoGerarClick);
    $(".botao-enviar").click(onBotaEnviarClick);
    $("#myFilter").keyup(onMyFilterKeyUp);
    $(".menu-item").click(onMenuItemClick)
    $("#botao-reload").click(onBotaoReloadClick);

    $(".popup-points").bind({popupafterclose : onMyPopupDialogClose });


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
