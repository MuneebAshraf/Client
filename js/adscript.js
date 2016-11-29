/**
 * Created by muneebashraf on 18/11/2016.
 */

$(document).on('click', '#reserveAdButton', function () {
    var adId = parseInt(sessionStorage.adId)
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/reservead",
        data: JSON.stringify({
            "id": adId
        }),
        success: function (book) {
            alert("You have now reserved this ad!");
            $('.ad').fadeOut("fast", function() { $(this).remove();sessionStorage.removeItem("adId"); });

        },
        error: function (xhr) {
            console.log("try again")
        }
    })
});

$(document).on('click', '#unReserveAdButton', function () {
    var reservedAd = $(this);
    reservedAd.parent().hide("fast");
    var adId = reservedAd.parent().data("adid");

    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/deletereservation",
        data: JSON.stringify({
            "id": adId
        }),
        success: function (book) {
            alert("Your reservation has been deleted!");
            getmyreservations()
        },
        error: function (xhr) {
            console.log("try again")
        }
    })
});

$(document).on('click', '#getMyReservations', function () {
    $(".dropdown-menu").slideToggle("fast");
    getmyreservations();
});
function getmyreservations() {
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
                    function locked() {
                        if (ad.locked != 0){return "no" } else {return "yes"}}
                    container.append(
                        "<div class='ads' data-adId=" + ad.adId + ">" +
                        "Seller: "+"<br>" + ad.userUsername + "<br>" +
                        "Sellers phonenumber: "+"<br>" + ad.userPhonenumber + "<br>" +
                        "Booked: " + "<br>"+ ad.timestamp + "<br>" +"<br>" +
                        "ISBN: " + ad.bookIsbn + "<br>" +
                        "<input type='button' id='unReserveAdButton' value='Delete reservation'>"+
                        "</div>"
                    )
                })
            },
            error: function (xhr, status, error) {
                alert("You haven't made any reservations yet")
                getAds();
            }
        }
    )
}

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
                if (ad.userMobilepay == 1){return "Accepts Mobilepay"}  else {return "Does not accept Mobilepay"}}
            function cash() {
                if (ad.userCash == 1)     {return "Accepts Cash"}       else {return "Does not accept Cash"}}
            function transfer() {
                if (ad.userTransfer == 1) {return "Accepts Transfers"}  else {return "Does not accept Transfers"}}
            function reserveButton() {
                if (document.getElementById('loginMenu').value != 'Login'){return "<input type='button' id='reserveAdButton' value='Reserve ad'>"} else {return ""}
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
                reserveButton()+
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

$(document).on('click', '#getAdsAll', function () {
    $(".dropdown-menu").slideToggle("fast");
    getAdsAll();
});
function getAdsAll() {
    document.getElementById("headerText").innerHTML = "See all ads";
    $("#container").empty();
    $.ajax({
            url: "https://localhost:8000/getadsall",
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
    getMyAds();
});
function getMyAds() {
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
                function locked() {if (ad.locked == 0) {return "no"} else {return "yes"}}
                function deleted() {if (ad.deleted == 0){return "no" } else {return "yes"}}
                container.append(
                    "<div class='ads' id=" + ad.adId + ">" +
                    "Price : " + ad.price + " kr" + "<br>" +
                    "Rating: " + ad.rating + "<br>" +
                    "ISBN: " + ad.isbn + "<br>" +
                    "Comment: " + ad.comment + "<br>" +
                    "Locked: " + locked() + "<br>" +
                    "Deleted: " + deleted() +
                    "</div>"
                )
            })
        },
        error: function (xhr, status, error) {
            alert("You haven't made any ads yet")
        }
    })
};

$(document).on('click', '#deleteAd', function () {
    $(document).off('click', '.ad');
    alert("click on any ad to ad it!");
    $(".dropdown-menu").slideToggle("fast");
    $(".ads").css("background-image", "url(../Resources/adPhoto-kopi.png)");
    $(".ads").hover(function () {
        $(this).css("text-shadow", "0 0 0.3em rgba(0, 255, 255, 0.64), 0 0 0.2em rgba(0, 255, 255, 0.64)");
        $(this).css("color", "white");
    }, function () {
        $(this).css("text-shadow", "");
        $(this).css("color", "black");
    });
    $(document).on('click', '.ads', function (event) {
        var everyChild = document.querySelectorAll("#container div");
        for (var i = 0; i < everyChild.length; i++) {
            if (everyChild[i].id == event.target.id) {
                var adId = parseInt(event.target.id);
                deleteAd(adId)
            }
        }
    });
});

function deleteAd(adId) {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/deletead",
        data: JSON.stringify({
            "id": adId
        }),
        success: function (book) {
            $("#"+adId).hide(["slow"]);
        },
        error: function (xhr) {
            console.log("try again")
        }
    })
}