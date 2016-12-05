/**
 * Created by muneebashraf on 29/11/2016.
 */

    $(document).on('click', '#createUserButton', function () {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('createUserBox').style.display = 'block';
        });
        $("#createuserForm").submit(function (e) {
            e.preventDefault();
            createUser()
    });

    $(document).on('click', '#deleteUserAdminButton', function () {
        userId = $(this).data("userid");
        deleteUserAdmin(userId)
    });

    $(document).on('click', '#deleteUserButton', function () {
        deleteUser()
    });
    $(document).on('click', '#updateUser', function () {
        $(".dropdown-menu").slideToggle("fast");
        document.getElementById('updateUserBox').style.display = 'block';
        document.getElementById("updateUsername").placeholder = sessionStorage.username;
        });
        $("#updateuserForm").submit(function (e) {
            e.preventDefault();
            updateUser();
    });

    $(document).on('click', '#getUsers', function () {
        $(".dropdown-menu").slideUp("fast");
        scroll()
        getUsers();
    });

function deleteUserAdmin(userId) {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/deleteuseradmin",
        data: JSON.stringify({
            "id": userId
        }),
        success: function (data) {
            alert(data)
            getUsers()
        },
        error: function (data) {
            alert("User could not be deleted and!\nCheck if the user has created any ads.")
        }
    })

}

function deleteUser() {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/deleteuser",
        success: function (data) {
            sessionStorage.clear();
            location.reload();
            alert("Your user has been deleted");

        },
        error: function (data) {
            alert("User could not be deleted and!\nCheck if the user has created any ads.")
        }
    })

}

function getUsers() {
    $.ajax({
        method: "POST",
        dataType: "json",
        xhrFields: {withCredentials: true},
        url: "https://localhost:8000/getusers",
        success: function (users) {
            document.getElementById("headerText").innerHTML = "Users";
            $("#container").empty();
            $("#container").append(
                "</div> " +
                    "<table class='table'>" +
                        "<thead> <th>Brugernavn</th>" +
                            "<th>Email</th> " +
                            "<th>Telefonnummer</th>" +
                            "<th>Adresse</th> " +
                        "</thead> " +
                        "<tbody id='userTableBody'>" +

                        "</tbody> " +
                "</table>"
            );
            var $userTableBody = $("#userTableBody");
            users.forEach(function (user) {
                $userTableBody.append(
                    "<tr>" +
                    "<td>" + user.username + "</td>" +
                    "<td>" + user.email + "</td>" +
                    "<td>" + user.phonenumber + "</td>" +
                    "<td>" + user.address + "</td>" +
                    "<td><input type='button' id='deleteUserAdminButton' value='Delete user' class='btn btn-success btn-sm' data-userid=" + user.userId + "></td>" +
                    "</tr>")
            });
        },
        error: function (data) {

        }
    })
}

function createUser() {
    var username   =  $("#newUsername").val();
    var password   =  $("#newPassword").val();
    var phonenumber= +$("#newPhonenumber").val();
    var address    =  $("#newAddress").val();
    var email      =  $("#newEmail").val();
    var mobilepay  = +(document.querySelector('input[name=mobilepay]:checked').value);
    var cash       = +(document.querySelector('input[name=cash]:checked').value);
    var transfer   = +(document.querySelector('input[name=transfer]:checked').value);
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
            alert("Congratulations " + username + "!\nYour user has been created\nUsername: " + username + "\nPassword: " + password+" !");
            document.getElementById('createUserBox').style.display = 'none';
            $('#newUsername').val('');
            $('#newPassword').val('');
            $('#newPhonenumber').val('');
            $('#newAddress').val('');
            $('#newEmail').val('');
            $('input[name="mobilepay"]').removeAttr('checked');
            $('input[name="cash"]').removeAttr('checked');
            $('input[name="transfer"]').removeAttr('checked');
        },
        error: function (data) {
            alert("Username is already taken, please try again with another username!")
        }
    })
}

function updateUser() {
    var username    = $("#updateUsername").val();
    var password    = $("#updatePassword").val();
    var phonenumber = +$("#updatePhonenumber").val();
    var address     = $("#updateAddress").val();
    var email       = $("#updateEmail").val();
    var mobilepay   = +(document.querySelector('input[name=updatemobilepay]:checked').value);
    var cash        = +(document.querySelector('input[name=updatecash]:checked').value);
    var transfer    = +(document.querySelector('input[name=updatetransfer]:checked').value);
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
        },
        error: function (data, foo, string) {
            alert("Your user could not be updated!\n");

        }

    })
}

