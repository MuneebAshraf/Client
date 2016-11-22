$(document).ready(function () {
    getAds();
    sessionLogin();

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
    function scroll() {
        $('html,body').animate({scrollTop: $("#sec1").offset().top}, 'slow');
        (document.getElementById("headerText").innerHTML = "See all books");


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
    $(document).on('click', '.close', function () {
        $('.ad').fadeOut("fast", function() { $(this).remove();sessionStorage.removeItem("adId"); });
        document.getElementById('loginBox').style.display='none';
        document.getElementById('createUserBox').style.display='none';
        document.getElementById('createBookBox').style.display='none';
        document.getElementById('updateUserBox').style.display='none';
        document.getElementById('createAdBox').style.display='none';
    });

    $(document).on('click', '.button', function () {
        $(".dropdown-menu").slideUp("fast");
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
                logout()
            })
        }
    });


    $(document).on('click', '.dropdown-menu li', function () {
        $("#loginMenu").toggleClass("unActive active");
    });

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
                        "<li id='getBooks'>See all books</li>" +
                        "<li id='createBook'>Create book</li>" +
                        "<li id='deleteBook'>Delete book</li>" +
                        "<li id='getadsAll'>See all ads</li>" +
                        "<li class="+"button"+">See ads</li>" +
                        "<li role='separator' class='divider'></li>" +
                        "<li id='getUsers'>See all users</li>" +
                        "<li id='updateUser'>Update profile information</li>" +
                        "<li role='separator' class='divider'></li>" +
                        "<li class=" + "logout" + ">Logout</li>"
                    )
                } else {
                    $(".dropdown-menu").append(
                        "<li id='createAd'>Create ad</li>" +
                        "<li id='getMyAds'>My ads</li>" +
                        "<li id='getMyReservations'>My reservations </li>" +
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
    $(document).on('click', '#createBook', function () {
        document.getElementById('createBookBox').style.display = 'block';
        $(".dropdown-menu").slideToggle("fast");
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

    $(document).on('click', '#getBooks', function () {
        $(".dropdown-menu").slideToggle("fast");
        document.getElementById("headerText").innerHTML = "See all Books";
        getBooks();
    });
    function getBooks() {
        scroll();
        $.ajax({
                url: "https://localhost:8000/getbooks",
                type: "GET",
                dataType: "json",
                cache: false,
                xhrFields: {withCredentials: true},
                success: function (books) {
                    $("#container").empty();
                    var container = $("#container");
                    books.forEach(function (book) {
                        container.append(
                            "<div class='books' id="+book.isbn+">" +
                            "Title: " + "<br>" + book.title + "<br>" +
                            "Author: " + "<br>" + book.author + "<br>" +
                            "Edition: " + book.edition + "<br>" +
                            "ISBN: " + book.isbn + "<br>" +
                            "</div>"
                        )
                    });
                },
                error: function (xhr) {
                }
            }
        );

    }

    $(document).on('click', '#reserveAdButton', function () {
        var adId = sessionStorage.adId;
        $.ajax({
            method: "POST",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/deletebook",
            data: JSON.stringify({
                "isbn": adId
            }),
            success: function (book) {
                alert("You have now reserved this ad!")
            },
            error: function (xhr) {
                console.log("try again")
            }
        })
    });

    $(document).on('click', '#getMyReservations', function () {
        $(".dropdown-menu").slideToggle("fast");
        $.ajax({
                method: "GET",
                dataType: "json",
                xhrFields: {withCredentials: true},
                url: "https://localhost:8000/getmyreservations",
                success: function (ads) {
                    scroll();
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



    $(document).on('click', '#deleteBook', function () {
        $(".dropdown-menu").slideToggle("fast");
        $(".books").css("background-image", "url(../Resources/adPhoto-kopi.png)");
        $(".books").hover(function () {
            $(this).css("text-shadow", "0 0 0.3em rgba(0, 255, 255, 0.64), 0 0 0.2em rgba(0, 255, 255, 0.64)");
            $(this).css("color", "white");
        }, function () {
            $(this).css("text-shadow", "");
            $(this).css("color", "black");
        });
    });

    $(document).on('click', '.books', function (event) {
        var everyChild = document.querySelectorAll("#container div");
        for (var i = 0; i < everyChild.length; i++) {
            if (everyChild[i].id == event.target.id) {
                var bookId = parseInt(event.target.id);
                deleteBook(bookId)
            }
        }
    });
    function deleteBook(bookId) {
        $.ajax({
            method: "POST",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/deletebook",
            data: JSON.stringify({
                "isbn": bookId
            }),
            success: function (book) {
            getBooks();
            },
            error: function (xhr) {
            console.log("try again")
            }
})}

    $(document).on('click', '.ads', function (event) {
    var everyChild = document.querySelectorAll("#container div");
    for (var i = 0; i < everyChild.length; i++) {
        if (everyChild[i].id == event.target.id) {
            var adId = parseInt(event.target.id);
            getAdPublic(adId)
        }
    }
    });
    function getAdPublic(adId) {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/getadpublic",
        data: JSON.stringify({
            "id": adId
        }),
        success: function (ad) {
            sessionStorage.adId = ad.adId;
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
                "Title: "+"<br>" + ad.bookTitle + "<br>" +
                "Author: "+"<br>" + ad.bookAuthor + "<br>" +
                "Edition: "+ ad.bookEdition + "<br>" +"<br>" +
                "Comment: "+"<br>" + ad.comment + "<br>" +
                "Rating: " + ad.rating + " out of 5" + "<br>" +
                "ISBN: " + ad.isbn + "<br>" + "<br>" +
                "Seller: " + ad.userUsername + "<br>" + "<br>" +

                mobilepay() + "<br>" +
                cash() + "<br>" +
                transfer() + "<br>" +"<br>" +

                "Price: " + ad.price + " kr" + "<br>" +
                    "<input type='button' id='reserveAdButton' value='Reserve ad'>"+
                "</div>"
            );
            $(".ad").fadeToggle("fast")
        },
        error: function (data, xhr, string) {
            console.log(data, xhr, string);
        }
    })
}

function getAds() {
    document.getElementById("headerText").innerHTML = "See all ads";
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
    $(".dropdown-menu").slideToggle("fast");
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
    $(".dropdown-menu").slideToggle("fast");
    $.ajax({
            method: "GET",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/getmyads",
            success: function (ads) {
                scroll();
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
    $(".dropdown-menu").slideToggle("fast");
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
















