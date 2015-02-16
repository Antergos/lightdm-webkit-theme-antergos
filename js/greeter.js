
//Will Revise for new layout

/*

function buildUserList() {
// User list building
    var userList = document.getElementById('user-list2');
    for (var i in lightdm.users) {
        var user = lightdm.users[i];
        var tux = 'img/antergos-logo-user.png';
        var imageSrc = user.image.length > 0 ? user.image : tux;
        var lastSession = localStorage.getItem(user.name);
        if (lastSession == null || lastSession == undefined) {
            localStorage.setItem(user.name, lightdm.default_session);
            lastSession = localStorage.getItem(user.name);
        }
        log('Last Session (' + user.name + '): ' + lastSession);
        var li = '<a href="#' + user.name + '" class="list-group-item ' + user.name + '" onclick="startAuthentication(\'' + user.name + '\')" session="' + lastSession + '">' +
            '<img src="' + imageSrc + '" class="img-square" alt="' + user.display_name + '" onerror="imgNotFound(this)"/> ' +
            '<span>' + user.display_name + '</span>' +
            '<span class="badge"><i class="fa fa-check"></i></span>' +
            '</a>';
        $(userList).append(li);
    }
}

*/


//Will revise for new layout

/*

function buildSessionList() {
// Build Session List
    for (i in lightdm.sessions) {
        var session = lightdm.sessions[i];
        var btnGrp = document.getElementById('sessions');
        var theClass = session.name.replace(/ /g, '');
        var button = '\n<li><a href="#" id="' + session.key + '" onclick="sessionToggle(this)" class="' + theClass + '">' + session.name + '</a></li>';

        $(btnGrp).append(button);
    }
}

*/

function get_hostname() {
    var hostname = lightdm.hostname;
    $('#hostname').append("<h3>" + hostname + "</h3>");
}



//  UI Init

$(document).ready(function() {
    
    //Sets clock?
    //initialize_timer();
    //Acquires hostname
    get_hostname();
    
    //buildUserList();
    //buildSessionList();
    
    //script for the menuclose button
    $('#menuClose').click(function() {
    $('#actionsPanel').slideUp(function() {
            $('#actionsCover').slideDown();
        });
    });
    
    //Script for wallClose button
    $('#wallClose').click(function() {
        $('#wallPane').animate({left: "+=100"}, 5000);
    });
    
    //Script for Wallpaper Changer
    $('.bgOpt').click(function() {
        var newBg = $(this).attr("data-img");
        if (newBg == 'random') {
            alert("DEBUG");
        }

        else {
        $('body').css("background-image", "url('/usr/share/antergos/wallpapers/" + newBg + "')"); 
        }
    });
    
    $('#actionsBtn').mouseenter(function() {
        $('#actionsCover').slideUp(function() {
            $('#actionsPanel').slideDown();
            //script for the wallpaper changer
            $('#wallSwitch').click(function() {
                $('#actionsPanel').slideUp(function() {
                    $('#wallPanel').fadeIn();
                });
            });         
        });
    }); 
});