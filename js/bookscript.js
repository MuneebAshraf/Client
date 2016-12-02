/**
 * Created by muneebashraf on 18/11/2016.
 */
    var verifyDelete =false;

    $(document).on('click', '.books', function (event) {
        var json = event.target.dataset;
        var bookId = parseInt(json.bookid);
        getAds();
        $("#searchads").val(bookId);
    });

    $(document).on('click', '#getBooks', function () {
        $(".dropdown-menu").slideToggle("fast");
        verifyDelete = false;
        scroll();
        getBooks();
    });

    $(document).on('click', '#deleteBook', function () {
        $(".dropdown-menu").slideToggle("fast");
        alert("click on any book to delete it!");
        getBooks();
        verifyDelete = true;
        $(document).on('click', '.books', function (event) {
            var json = event.target.dataset;
            var bookId = parseInt(json.bookid);
            if (verifyDelete){
                deleteBook(bookId)
            }
        });
    });

    $(document).on('click', '#createBook', function () {
        document.getElementById('createBookBox').style.display = 'block';
        $(".dropdown-menu").slideToggle("fast");
        });
        $("#createBookForm").submit(function (e) {
            e.preventDefault();
            createBook()
    });


    function getBooks() {
        document.getElementById("headerText").innerHTML = "Books";
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
                        "<div class='books' data-bookId="+book.isbn+">" +
                        "Title: "   + "<br>" + book.title   + "<br>" +
                        "Author: "  + "<br>" + book.author  + "<br>" +
                        "Edition: " +          book.edition + "<br>" +
                        "ISBN: "    +          book.isbn    + "<br>" +
                        "</div>"
                    )
                });
            },
            error: function (xhr) {
            }
        });
    }

    function createBook() {
        var title   = $("#bookTitle").val();
        var author  = $("#bookAuthor").val();
        var edition = $("#bookEdition").val();
        var isbn    = parseInt($("#bookIsbn").val());

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
                $('[data-bookid='+bookId+']').hide(["slow"]);
            },
            error: function (xhr) {
            }
        })
    }
