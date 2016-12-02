function scroll() {
    $('html,body').animate({scrollTop: $("#sec1").offset().top}, 'slow');
}

$(document).ready(function () {
    sessionLogin();
    getAds();

    $(document).on('click', '.button', function () {
        $(".dropdown-menu").slideUp("fast");
        if(!($('.dropdown-menu').is(':hidden'))){
            $("#loginMenu").toggleClass("unActive active");
        }
        scroll();
        getAds();
    });

    $(document).on('click', '#loginMenu', function () {
        if (document.getElementById('loginMenu').value == 'Login') {
            document.getElementById('loginBox').style.display = 'block'
        } else {
            $("#loginMenu").attr("data-toggle", "dropdown");
            $(".dropdown-menu").slideToggle("fast");
            $("#loginMenu").toggleClass("unActive active");
            $(document).on('click', '.logout', function () {
                $(".dropdown-menu").slideUp("fast");
                logout()
            })
        }
    });

    $(document).on('click', '.dropdown-menu li', function () {
        $("#loginMenu").toggleClass("unActive active");
        $('.ad').fadeOut("fast", function() { $(this).remove();sessionStorage.removeItem("adId"); });
    });

    function contains(text_one, text_two) {
        if (text_one.indexOf(text_two) != -1)
            return true}
        $("#searchads").keyup(function () {
        var searchads = $("#searchads").val().toLowerCase();
        $("#container div").each(function () {
            if (!contains($(this).text().toLowerCase(), searchads))
                $(this).hide("fast");
            else
                $(this).show("fast");
        });
    });

    $(document).on('click', '.close', function () {
        $('.ad').fadeOut("fast", function() { $(this).remove();sessionStorage.removeItem("adId"); });
        document.getElementById('loginBox').style.display='none';
        document.getElementById('createUserBox').style.display='none';
        document.getElementById('createBookBox').style.display='none';
        document.getElementById('updateUserBox').style.display='none';
        document.getElementById('createAdBox').style.display='none';
    });

    jQuery.fn.exists = function(){return this.length>0;};
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            if ((document.getElementById('loginBox').style.display = 'block') ||
                (document.getElementById('createUserBox').style.display = 'block') ||
                (document.getElementById('updateUserBox').style.display = 'block') ||
                (document.getElementById('createAdBox').style.display = 'block') ||
                (document.getElementById('createBookBox').style.display = 'block') ||
                !(document.getElementById('searchads').value = '') ||
                ($(".ad").exists())) {

                $(".dropdown-menu").slideUp("fast");
                document.getElementById('loginBox').style.display = 'none';
                document.getElementById('createUserBox').style.display = 'none';
                document.getElementById('updateUserBox').style.display = 'none';
                document.getElementById('createAdBox').style.display = 'none';
                document.getElementById('createBookBox').style.display = 'none';
                document.getElementById('searchads').value = '';
                $('.ad').fadeOut("fast", function() { $(this).remove();sessionStorage.removeItem("adId"); });
            }
        }
    };

    function sessionLogin() {
        if (!(sessionStorage.username == undefined) && !(sessionStorage.password == undefined) && !(sessionStorage.type==undefined)) {
            login(sessionStorage.username, sessionStorage.password);
            if (!(document.getElementById("loginMenu").value = sessionStorage.username))
                location.reload();
        } else {
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("password");
            sessionStorage.removeItem("type"); }
    }

    $("#loginForm").submit(function (e) {
        var username = $("#username").val().toLowerCase();
        var password = $("#password").val();
        e.preventDefault();
        login(username, password);
    });

    function login(username, password) {
    $.ajax({
        type: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/login",
        data: JSON.stringify({
            "username": username,
            "password": password
        }),
        success: function (user) {
            document.getElementById('loginBox').style.display = 'none';
            if (user.type === 1) {
                $(".dropdown-menu").append(
                    "<li id='getBooks'>Show books</li>" +
                    "<li id='createBook'>Create book</li>" +
                    "<li id='deleteBook'>Delete book</li>" +
                    "<li id='getAdsAll'>Show all ads</li>" +
                    "<li class="+"button"+"><Show></Show> ads</li>" +
                    "<li role='separator' class='divider'></li>" +
                    "<li id='getUsers'>See all users</li>" +
                    "<li id='updateUserAdmin'>Update profile information</li>" +
                    "<li role='separator' class='divider'></li>" +
                    "<li class=" + "logout" + ">Logout</li>"
                )
            } else {
                $(".dropdown-menu").append(
                    "<li id='getMyAds'>My ads</li>" +
                    "<li id='getAds'>Show ads</li>" +
                    "<li id='getBooks'>Show books</li>" +
                    "<li id='createAd'>Create ad</li>" +
                    "<li id='deleteAd'>Delete ad</li>" +
                    "<li id='getMyReservations'>My reservations </li>" +
                    "<li role='separator'' class='divider'></li>" +
                    "<li id='updateUser'>Update profile information</li>" +
                    "<li role='separator'' class='divider'></li>" +
                    "<li class=" + "logout" + ">Logout</li>"
                )
            }

            document.getElementById("loginMenu").value = "Menu";
            sessionStorage.username = username;
            sessionStorage.password = password;
            sessionStorage.type = user.type;
            $("#username").val('');
            $("#password").val('');
        },
        error: function (data) {
            alert("You username or password is not valid.\nPlease try again!");
            $("#password").val('');
        }
    })
}

function logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("adId");
    $.ajax({
            url: "https://localhost:8000/logout",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: "GET",
            dataType: "json",
            success: function (data) {
                document.getElementById("loginMenu").value = 'Login';
                $("#loginMenu").attr("data-toggle", "");
                $(".dropdown-menu").empty();

            },
            error: function (error) {
                location.reload();
                logout();
            }
        }
    )
}

});
















