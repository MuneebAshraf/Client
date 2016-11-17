$(document).ready(function () {
    getAds();
    sessionLogin();

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

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            if ((document.getElementById('loginBox').style.display = 'block') ||
                (document.getElementById('createUserBox').style.display = 'block') ||
                (document.getElementById('updateUserBox').style.display = 'block') ||
                (document.getElementById('createAdBox').style.display = 'block') ||
                !(document.getElementById('searchads').value=''))

            {
                document.getElementById('loginBox').style.display = 'none';
                document.getElementById('createUserBox').style.display = 'none';
                document.getElementById('updateUserBox').style.display = 'none';
                document.getElementById('createAdBox').style.display = 'none';
                document.getElementById('searchads').value='';
            }
        }
    };

    $(".button").click(function () {
        getAds();
        $('html,body').animate({scrollTop: $("#sec1").offset().top }, 'slow');
    });

   function sessionLogin() {
        var username = sessionStorage.username;
        var password = sessionStorage.password;
        if (!(username == undefined) && !(password == undefined)){
            login(username,password)
        }
    };

    $("#loginMenu").click(function () {
        if (document.getElementById('loginMenu').value == 'Login') {
            document.getElementById('loginBox').style.display = 'block'
        } else {
            $("#loginMenu").attr("data-toggle", "dropdown");
        }
    });

    $("#loginForm").submit(function (e) {
        var username = $("#username").val();
        var password = $("#password").val();
        e.preventDefault();
        login(username,password);
    });
    function login(username,password) {
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
                document.getElementById("loginMenu").value = username;

                sessionStorage.username=username;
                sessionStorage.password=password;
                $("#username").val('');
                $("#password").val('');
            },
            error: function (data) {
                alert("You username or password is not valid.\nPlease try again!");
                $("#username").val('');
                $("#password").val('');
            }
        })
    }

    $("#logout").click(function () {
        logout()

    });
    function logout() {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("password");
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
                },
                error: function (error) {
                    location.reload();
                    logout();
                }
            }
        )
    }



   $("div").click(function (event) {
           var everyChild = document.querySelectorAll("#container div");
           for (var i = 0; i<everyChild.length; i++) {
               if (everyChild[i].id == event.target.id)
                   var adid = event.target.id;
           }

        $.ajax({
            method: "POST",
            dataType: "json",
            xhrFields: {withCredentials: true},
            url: "https://localhost:8000/getad",
            data: JSON.stringify({
                "adid":adid
            }),
            success: function (ad) {


            },
            error: function () {

            }
            }
        )
       }
       );

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
                            "<div class='ads' id="+ad.adId+">" +
                            "Title: " + ad.bookTitle + "<br>" +
                            "Author: " + ad.bookAuthor + "<br>" +
                            "Edition: " + ad.bookEdition + "<br>" +
                            "Rating: " + ad.rating + "<br>" +
                            "ISBN: " + ad.isbn + "<br>" +
                            "Price: " + ad.price + " kr" +
                            "</div>"
                        )
                    })
                },
                error: function (xhr) {
                }
            }
        );
    }

    $("#createAd").click(function () {
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
                "isbn":isbn,
                "rating":rating,
                "comment":comment,
                "price":price
            }),
            success: function (data) {
            document.getElementById('createAdBox').style.display = 'none';
            location.reload();
            },
            error: function (data) {
            }
        })
    }

    $("#getMyAds").click(function () {
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
                            "<div class='ads' id="+ad.adId+">" +
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

    
    
    
    
    $("#createUserButton").click(function () {
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
                alert("Congratulations " + username + "!\nYour user has been created\nUsername: "+username+"\nPassword: "+password+"\nWe will log you in so you can start right away!");
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
                login(username,password);
            },
            error: function (data) {
                alert("Username is already taken, please try again with another username!")
            }

        })
    }

    $("#updateUser").click(function () {
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















