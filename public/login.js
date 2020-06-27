var email = document.getElementById("email");
var password = document.getElementById("password");
var emailLabel = document.getElementById("label-email");
var passwordLabel = document.getElementById("label-password");
var isCorrect = false;
var modalBgSign = document.getElementById('modal-bg');
var modalCloseSign = document.getElementById('modal-close');
var forgot = document.getElementById('forgot');
var correctExceptForCap = false;

forgot.addEventListener('click', function() {
    modalBgSign.classList.toggle("showForgot");
});

modalCloseSign.addEventListener('click', function() {
    modalBgSign.classList.toggle("showForgot");
}); 

email.addEventListener("focusout", onfocusout);
password.addEventListener("focusout", onfocusoutPassword);

function onfocusout(e) {
    if (email.value.length > 0) email.classList.add('not-empty');
    else email.classList.remove('not-empty');
}

function onfocusoutPassword(e) {
    if (password.value.length > 0) password.classList.add('not-empty');
    else password.classList.remove('not-empty');
}

// allow focus of the input even on click of div
emailLabel.onclick = function(e) {
    email.focus();
}

passwordLabel.onclick = function(e) {
    password.focus();
}

//First get a reference of the input fields
var emailS = document.getElementById("emailS");
var fName = document.getElementById("fName");
var lName = document.getElementById("lName");
var confirmPass = document.getElementById('confirm-password');
var passwordS = document.getElementById("passwordS");
var emailForgot = document.getElementById("emailForgot");

//now get the label associated with it that will move up
var emailLabelS = document.getElementById("label-emailS");
var passwordLabelS = document.getElementById("label-passwordS");
var confirmLabel = document.getElementById("label-confirm");
var firstLabel = document.getElementById("label-first");
var lastLabel = document.getElementById("label-last");
var labelForgot = document.getElementById("label-forgot");

//now add an event listener to it
emailS.addEventListener("focusout", onfocusoutS);
passwordS.addEventListener("focusout", onfocusoutPasswordS);
confirmPass.addEventListener("focusout", onfocusoutPasswordConfirm);
fName.addEventListener("focusout", onfocusoutFirst);
lName.addEventListener("focusout", onfocusoutLast);
emailForgot.addEventListener("focusout", onfocusoutForgot);

//now the functions I just made above
function onfocusoutPasswordConfirm(e) {
    if (confirmPass.value.length > 0) confirmPass.classList.add('not-empty');
    else confirmPass.classList.remove('not-empty');
}

function onfocusoutS(e) {
    if (emailS.value.length > 0) emailS.classList.add('not-empty');
    else emailS.classList.remove('not-empty');
}

function onfocusoutPasswordS(e) {
    if (passwordS.value.length > 0) passwordS.classList.add('not-empty');
    else passwordS.classList.remove('not-empty');
}

function onfocusoutFirst(e) {
    if (fName.value.length > 0) fName.classList.add('not-empty');
    else fName.classList.remove('not-empty');
}

function onfocusoutLast(e) {
    if (lName.value.length > 0) lName.classList.add('not-empty');
    else lName.classList.remove('not-empty');
}

function onfocusoutForgot(e) {
    if (emailForgot.value.length > 0) emailForgot.classList.add('not-empty');
    else emailForgot.classList.remove('not-empty');
}

// allow focus of the input even on click of div

confirmLabel.onclick = function(e) { confirmPass.focus(); }

firstLabel.onclick = function(e) { fName.focus(); }

lastLabel.onclick = function(e) {lName.focus(); }

emailLabelS.onclick = function(e) { emailS.focus(); }

passwordLabelS.onclick = function(e) {passwordS.focus(); }

labelForgot.onclick = function(e) {emailForgot.focus(); }

function goAway() {
    getRandomString();
    document.getElementById("theForm").classList.toggle("goaway");
    document.getElementById("myForm").classList.toggle("showMe");
    document.getElementById("signUpContainer").style["visibility"] = "hidden";
    document.getElementById("signin-link").style["visibility"] = "visible";
}

function comeBack() {
    document.getElementById("theForm").classList.toggle("goaway");
    document.getElementById("myForm").classList.toggle("showMe");
    document.getElementById("signUpContainer").style["visibility"] = "visible";
    document.getElementById("signin-link").style["visibility"] = "hidden";
}

function forgotPassword() {
    document.getElementById("password-holder").style.opacity = 0;
}

function getRandomString() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    document.getElementById("t1").innerHTML = result[0];
    document.getElementById("t2").innerHTML = result[1];
    document.getElementById("t3").innerHTML = result[2];
    document.getElementById("t4").innerHTML = result[3];
    document.getElementById("t5").innerHTML = result[4];
    document.getElementById("t6").innerHTML = result[5];
}
function validateRobot() {
    var correct = "";
    var indicator = document.getElementById("reset-text");
    correct += document.getElementById("t1").innerHTML +
    document.getElementById("t2").innerHTML +
    document.getElementById("t3").innerHTML +
    document.getElementById("t4").innerHTML +
    document.getElementById("t5").innerHTML +
    document.getElementById("t6").innerHTML;
    if (correct != document.getElementById("robot-input").value) {
        deleteToast("Error in captcha");
    } else {
        indicator.classList.remove("fa-refresh");
        indicator.classList.add("fa-check");
        indicator.style.color = "green";
        isCorrect = true;
        correctExceptForCap = true;
    }
}

function validateForm() {
    var fname = document.getElementById("fName").value;
    var lname = document.getElementById("lName").value;
    var email = document.getElementById("emailS").value;
    var password = document.getElementById("passwordS").value;
    var confirm = document.getElementById("confirm-password").value;
  
    if (fname.length == 0 || lname.length == 0 ||
        email.length == 0 || password.length == 0 ||
        confirm.length == 0)
        deleteToast("Please fill out all fields");
    else if(password != confirm) 
        deleteToast("Passwords must match");
    else if (!isCorrect)  
        validateRobot();

    if (correctExceptForCap) {
        var myForm = document.getElementById("sign-up-form");
        myForm.action = "../auth/signup"
        myForm.submit();
    }

}

function deleteToast(text) {
    if (text === 'E-Mail exists already') 
        goAway();

    var toast = document.getElementById("snackbar");
    
    // Add the "show" class to DIV
    toast.className = "show";
    toast.innerHTML = text;

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

function validateForgot() {
    if (document.getElementById("emailForgot").value.length == 0) deleteToast("Enter your email to proceed");
}

function validateLogin() {
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var myForm = document.getElementById("login-form");

    if (password.length == 0 || email.length == 0) deleteToast("Fill out all fields");
    else {
        myForm.action = "../auth/login";
        myForm.submit();
    }
}