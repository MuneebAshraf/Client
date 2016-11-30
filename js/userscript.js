/**
 * Created by muneebashraf on 29/11/2016.
 */


    $(document).on('click', '#createUserButton', function () {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('createUserBox').style.display = 'block';
        });
        $("#createuserForm").submit(function (e) {
            e.preventDefault();
            createuser()
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

function createuser() {
    var username    =          $("#newUsername").val();
    var password    =          $("#newPassword").val();
    var phonenumber = parseInt($("#newPhonenumber").val());
    var address     =          $("#newAddress").val();
    var email       =          $("#newEmail").val();
    var mobilepay   = parseInt(document.querySelector('input[name=mobilepay]:checked').value);
    var cash        = parseInt(document.querySelector('input[name=cash]:checked').value);
    var transfer    = parseInt(document.querySelector('input[name=transfer]:checked').value);
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

