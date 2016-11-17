$(document).ready(function () {
        var $adsTableBody = $("#adsTableBody");

        $.ajax({
                url: "https://localhost:8000/getads",
                type: "GET",
                dataType: "json",
                xhrFields: {withCredentials: true},
                success: function (ads, status, xhr) {
                    console.log(status)
                    ads.forEach(function (ad) {
                        $adsTableBody.append(
                            "<tr>" +
                            "<td>" + ad.bookTitle + "</td>" +
                            "<td>" + ad.bookAuthor + "</td>" +
                            "<td>" + ad.bookEdition + "</td>" +
                            "<td>" + ad.rating + "</td>" +
                            "<td>" + ad.isbn + "</td>" +
                            "<td>" + ad.price + "</td>" +
                            "</tr>"
                        )
                    })
                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error)
                }
            }
        )
    }
);

