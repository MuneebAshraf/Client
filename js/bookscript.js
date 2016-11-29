/**
 * Created by muneebashraf on 18/11/2016.
 */
$(document).ready(function () {

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
                $(document).onload(function () {
                    getBooks();
                });


            },
            error: function (data) {
                alert("could not create book")
            }
        })
    }

    $(document).on('click', '#getBooks', function () {
        $(".dropdown-menu").slideToggle("fast");
        getBooks();
    });
    function getBooks() {
        document.getElementById("headerText").innerHTML = "See all Books";
        scroll();

        $.ajax({
                url: "https://localhost:8000/getbooks",
                type: "GET",
                dataType: "json",
                xhrFields: {withCredentials: true},
                success: function (books) {
                    $("#container").empty();
                    var container = $("#container");
                    books.forEach(function (book) {
                        container.append(
                            "<div class='books' id=" + book.isbn + ">" +
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


    $(document).on('click', '#deleteBook', function () {
        getBooks();
        alert("click on any book to delete it!");
        $(".dropdown-menu").slideToggle("fast");

        $(document).on('click', '.books', function (event) {
            var everyChild = document.querySelectorAll("#container div");
            for (var i = 0; i < everyChild.length; i++) {
                if (everyChild[i].id == event.target.id) {
                    var bookId = parseInt(event.target.id);
                    deleteBook(bookId)
                }
            }
        });
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
                $("#" + bookId).hide(["slow"]);
            },
            error: function (xhr) {
                console.log("try again")
            }
        })
    }
})