// The Javascripting of the greeter

function get_hostname() {
    var hostname = lightdm.hostname;
    $('#hostname').append("<h3>" + hostname + "</h3>");
}

function update_time() {
    var time = $("#currentTime");
    var date = new Date();
    var twelveHr = [
        'sq-al',
        'zh-cn',
        'zh-tw',
        'en-au',
        'en-bz',
        'en-ca',
        'en-cb',
        'en-jm',
        'en-ng',
        'en-nz',
        'en-ph',
        'en-us',
        'en-tt',
        'en-zw',
        'es-us',
        'es-mx'];
    var userLang = window.navigator.language;
    var is_twelveHr = twelveHr.indexOf(userLang);
    var hh = date.getHours();
    var mm = date.getMinutes();
    var suffix = "AM";
    if (hh >= 12) {
        suffix = "PM";
        if (is_twelveHr !== -1 && is_twelveHr !== 12) {
            hh = hh - 12;
        }
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (hh === 0 && is_twelveHr !== -1) {
        hh = 12;
    }
    time.innerHTML = hh + ":" + mm + " " + suffix;
}

function initialize_timer() {
    var userLang = window.navigator.language;
    log(userLang);
    update_time();
    setInterval(update_time, 60000);
}


// Interactive UI

$(document).ready(function() {
    var bgSaved = null;
    
    //Function for the random background option
    function randomBG() {
            localStorage.setItem("bgsaved", '');
            $(".bgOpt .bg .random").first().addClass('active');
            var arrayBackground = [];
            $('.bgOpt').each(function(i) {
                if (i > 0) {
                    arrayBackground.push($(this).attr('data-img'));
                }
            });
            var randBG = arrayBackground[Math.floor(Math.random() * arrayBackground.length)];
            $('#bgDiv').fadeTo('slow', 0.3, function() {
                $("#bgDiv").css("background", "url('/usr/share/antergos/wallpapers/" + randBG + "')");
            }).fadeTo('slow', 1);
    }
    
    
    //Starts clock
    //initialize_timer();    
    //Acquires hostname
    get_hostname();
    
    //Builds the list of users
    //buildUserList();
    //Builds the list of desktops/sessions
    //buildSessionList();
    
    //script for the menuclose button
    $('#menuClose').click(function() {
        $('#actionsPanel').fadeOut(function() {
            $('#actionsCover').fadeIn();
        });
    });
    
    //Script for wallClose button
    $('#wallClose').click(function() {
        console.log("Closed!");
        $('#wallPane').slideUp();
        $('#loginPane').css("opacity", "1");
        $('#actionsCover').fadeIn();
    });

    //Script for Wallpaper Changer
    $('.bgOpt').click(function() {
        var newBg = $(this).attr("data-img");
        if (newBg == 'random') {
            alert("DEBUG");
        }

        else {
             $(bgSaved).toggleClass("activeThumb");
             $(this).toggleClass("activeThumb");
             $('#bgDiv').fadeTo('slow', .4, function() {
                        $("#bgDiv").css("background", "url('/usr/share/antergos/wallpapers/" + newBg + "')");
             }).fadeTo('slow', 1);
            bgSaved = this;
            
            
            
        }
    });
    
    //Script for Action Menu
    $('#actionsBtn').mouseenter(function() {
        $('#actionsCover').fadeOut(function() {
            $('#actionsPanel').fadeIn();
            //script for the wallpaper changer
            $('#wallSwitch').click(function() {
                $('#actionsPanel').fadeOut("fast", function() {
                    $('#loginPane').css("opacity", "0.5");
                    $('#wallPane').slideDown();
                });
            });         
        });
    }); 
});