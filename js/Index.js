$(document).ready(function () {
    getAds();
    sessionLogin();

    function sessionLogin() {
        if (!(sessionStorage.username == undefined) && !(sessionStorage.password == undefined) && !(sessionStorage.type==undefined)) {
            login(sessionStorage.username, sessionStorage.password)
        } else {
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("password");
            sessionStorage.removeItem("type"); }
    }

    function contains(text_one, text_two) {
        if (text_one.indexOf(text_two) != -1)
            return true
    }

    $("#searchads").keyup(function () {
        var searchads = $("#searchads").val().toLowerCase();
        $("#container div").each(function () {
            if (!contains($(this).text().toLowerCase(), searchads))
                $(this).hide("fast");
            else
                $(this).show("fast");
        });
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

                document.getElementById('loginBox').style.display = 'none';
                document.getElementById('createUserBox').style.display = 'none';
                document.getElementById('updateUserBox').style.display = 'none';
                document.getElementById('createAdBox').style.display = 'none';
                document.getElementById('createBookBox').style.display = 'none';
                document.getElementById('searchads').value = '';
                $('.ad').remove()
            }
        }
    };
    $(document).on('click', '.close', function () {
        $('.ad').remove()
        document.getElementById('loginBox').style.display='none';
        document.getElementById('createUserBox').style.display='none';
        document.getElementById('createBookBox').style.display='none';
        document.getElementById('updateUserBox').style.display='none';
        document.getElementById('createAdBox').style.display='none';
    });

    $(document).on('click', '.button', function () {
        getAds();
        $('html,body').animate({scrollTop: $("#sec1").offset().top}, 'slow');
    });

    $(document).on('click', '#loginMenu', function () {
        if (document.getElementById('loginMenu').value == 'Login') {
            document.getElementById('loginBox').style.display = 'block'
        } else {
            $("#loginMenu").attr("data-toggle", "dropdown");
            $(document).on('click', '.logout', function () {
                logout()
            })
        }
    });

    $("#loginForm").submit(function (e) {
        var username = $("#username").val();
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
                        "<li id='createBook'>Create book</li>" +
                        "<li id='deleteBook'>Delete book</li>" +
                        "<li id='getadsAll'>See all ads</li>" +
                        "<li class="+"button"+">See ads</li>" +
                        "<li role='separator' class='divider'></li>" +
                        "<li id='getUsers'>See all users</li>" +
                        "<li role='separator' class='divider'></li>" +
                        "<li class=" + "logout" + ">Logout</li>"
                    )
                } else {
                    $(".dropdown-menu").append(
                        "<li id='createAd'>Create ad</li>" +
                        "<li id='getMyAds'>See my ads</li>" +
                        "<li class='button'>See ads</li>" +
                        "<li role='separator'' class='divide'></li>" +
                        "<li id='updateUser'>Update profile information</li>" +
                        "<li role='separator'' class='divider'></li>" +
                        "<li class=" + "logout" + ">Logout</li>"
                    )
                }

                document.getElementById("loginMenu").value = username.toLowerCase();
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
    $(document).on('click', '#createBook', function () {
        document.getElementById('createBookBox').style.display = 'block';
    });
    $("#createBookForm").submit(function (e) {
        e.preventDefault();
        createBook()
    });
    function createBook() {
        var title = $("#bookTitle").val();
        var author = $("#bookAuthor").val();
        var edition = $("#bookEdition").val();
        var isbn = parseInt($("#bookIsbn").val());

        $.ajax({
            method: "POST",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/createbook",
            data: JSON.stringify({
                "isbn": isbn,
                "title": title,
                "edition": edition,
                "author": author
            }),
            success: function (data) {
                document.getElementById('createBookBox').style.display = 'none';
                location.reload();
            },
            error: function (data) {
                alert("could not create book")
            }
        })
    }

    $(document).on('click', 'div', function (event) {
    var everyChild = document.querySelectorAll("#container div");
    for (var i = 0; i < everyChild.length; i++) {
        if (parseInt(everyChild[i].id) == parseInt(event.target.id)) {
            var adId = event.target.id;
            getAd(parseInt(adId))
        }
    }
});
function getAd(adId) {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/getad",
        data: JSON.stringify({
            "id": adId
        }),
        success: function (ad) {
            function mobilepay() {
                if (ad.userMobilepay == 1) {
                    return "Accepts Mobilepay"
                } else {
                    return "Does not accept Mobilepay"
                }
            }

            function cash() {
                if (ad.userCash == 1) {
                    return "Accepts Cash"
                } else {
                    return "Does not accept Cash"
                }
            }

            function transfer() {
                if (ad.userTransfer == 1) {
                    return "Accepts Transfers"
                } else {
                    return "Does not accept Transfers"
                }
            }

            $("#adContainer").append(
                "<div class='ad' id='reserveAdBox'>" + "<span class='close' title='Close Modal'>&times;</span>" +
                "Comment: " + ad.comment + "<br>" +
                "Rating: " + ad.rating + " out of 5" + "<br>" +
                "Price: " + ad.price + " kr" + "<br>" +
                "ISBN: " + ad.isbn + "<br>" + "<br>" +
                mobilepay() + "<br>" +
                cash() + "<br>" +
                transfer() +

                "</div>"
            )
        },
        error: function (data, xhr, string) {
            console.log(data, xhr, string);
        }
    })
}

function getAds() {
    $("#container").empty();
    $.ajax({
            url: "https://localhost:8000/getads",
            type: "GET",
            dataType: "json",
            cache: false,
            xhrFields: {withCredentials: true},
            success: function (ads) {
                var container = $("#container");
                ads.forEach(function (ad) {
                    container.append(
                        "<div class='ads' id=" + ad.adId + ">" +
                        "Title: " + "<br>" + ad.bookTitle + "<br>" +
                        "Author: " + "<br>" + ad.bookAuthor + "<br>" +
                        "Edition: " + ad.bookEdition + "<br>" +
                        "Rating: " + ad.rating + "<br>" +
                        "ISBN: " + ad.isbn + "<br>" +
                        "Price: " + "<br>" + ad.price + " kr" +
                        "</div>"
                    )
                });
            }
            ,
            error: function (xhr) {
            }
        }
    );
}

    $(document).on('click', '#createAd', function () {
    document.getElementById('createAdBox').style.display = 'block';
});
$("#createAdForm").submit(function (e) {
    e.preventDefault();
    createAd()
});
function createAd() {
    var isbn = parseInt($("#adIsbn").val());
    var rating = parseInt($("#adRating").val());
    var comment = $("#adComment").val();
    var price = parseInt($("#adPrice").val());

    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/createad",
        data: JSON.stringify({
            "isbn": isbn,
            "rating": rating,
            "comment": comment,
            "price": price
        }),
        success: function (data) {
            document.getElementById('createAdBox').style.display = 'none';
            location.reload();
        },
        error: function (data) {
        }
    })
}

    $(document).on('click', '#getMyAds', function () {
    $.ajax({
            method: "GET",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/getmyads",
            success: function (ads) {
                $("#container").empty();
                var container = $("#container");
                ads.forEach(function (ad) {
                    container.append(
                        "<div class='ads' id=" + ad.adId + ">" +
                        "Price : " + ad.price + " kr" + "<br>" +
                        "Rating: " + ad.rating + "<br>" +
                        "ISBN: " + ad.isbn + "<br>" +
                        "Comment: " + ad.comment + "<br>" +
                        "Locked: " + ad.locked + "<br>" +
                        "Deleted: " + ad.deleted +
                        "</div>"
                    )
                })
            },
            error: function (xhr, status, error) {
                alert("You haven't made any ads yet")
            }
        }
    )
});


    $(document).on('click', '#createUserButton', function () {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('createUserBox').style.display = 'block';
});
$("#createuserForm").submit(function (e) {
    e.preventDefault();
    createuser()
});
function createuser() {
    var username = $("#newUsername").val();
    var password = $("#newPassword").val();
    var phonenumber = parseInt($("#newPhonenumber").val());
    var address = $("#newAddress").val();
    var email = $("#newEmail").val();
    var mobilepay = parseInt(document.querySelector('input[name=mobilepay]:checked').value);
    var cash = parseInt(document.querySelector('input[name=cash]:checked').value);
    var transfer = parseInt(document.querySelector('input[name=transfer]:checked').value);

    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/createuser",
        data: JSON.stringify({
            "username": username,
            "password": password,
            "phonenumber": phonenumber,
            "address": address,
            "email": email,
            "mobilepay": mobilepay,
            "cash": cash,
            "transfer": transfer
        }),
        success: function (data) {
            alert("Congratulations " + username + "!\nYour user has been created\nUsername: " + username + "\nPassword: " + password + "\nWe will log you in so you can start right away!");
            document.getElementById('createUserBox').style.display = 'none';
            document.getElementById("loginMenu").value = username;
            $('#newUsername').val('');
            $('#newPassword').val('');
            $('#newPhonenumber').val('');
            $('#newAddress').val('');
            $('#newEmail').val('');
            $('input[name="mobilepay"]').removeAttr('checked');
            $('input[name="cash"]').removeAttr('checked');
            $('input[name="transfer"]').removeAttr('checked');
            login(username, password);
        },
        error: function (data) {
            alert("Username is already taken, please try again with another username!")
        }

    })
}

    $(document).on('click', '#updateUser', function () {
    document.getElementById('updateUserBox').style.display = 'block';
});
$("#updateuserForm").submit(function (e) {
    e.preventDefault();
    updateUser();
});

function updateUser() {
    var username = $("#updateUsername").val();
    var password = $("#updatePassword").val();
    var phonenumber = parseInt($("#updatePhonenumber").val());
    var address = $("#updateAddress").val();
    var email = $("#updateEmail").val();
    var mobilepay = parseInt(document.querySelector('input[name=updatemobilepay]:checked').value);
    var cash = parseInt(document.querySelector('input[name=updatecash]:checked').value);
    var transfer = parseInt(document.querySelector('input[name=updatetransfer]:checked').value);

    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/updateuser",
        data: JSON.stringify({
            "username": username,
            "password": password,
            "phonenumber": phonenumber,
            "address": address,
            "email": email,
            "mobilepay": mobilepay,
            "cash": cash,
            "transfer": transfer
        }),
        success: function (data) {
            document.getElementById('updateUserBox').style.display = 'none';
            document.getElementById("loginMenu").value = username;

        },
        error: function (data, foo, string) {
            alert("Your user could not be updated!\n");

        }

    })
}

});
















