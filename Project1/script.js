function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function validatePhone(phone) {
  return !isNaN(phone) && phone.length > 4;
}

function validatePassword(password) {
  return password.length >= 4 && password.length <= 60;
}

var mail = document.getElementById('mail');
var mailWarning = document.getElementById('warningEmail');

var password = document.getElementById('password');
var passwordWarning = document.getElementById('warningPassword');

function toggleFieldError(isMail, status) {
  var method = status ? 'add' : 'remove';
  var warning = isMail ? mailWarning : passwordWarning;
  var input = isMail ? mail : password;
  warning.classList[method]('visible');
  input.classList[method]('error');
}

mail.addEventListener('input', function(e) {
  if (e.target.value) {
    mail.classList.add('hasText');
  } else {
    mail.classList.remove('hasText');
  }

  if (!e.target.value) {
    mail.classList.remove('forMail');
    mail.classList.remove('forPhone');
    mailWarning.innerText = 'Lütfen geçerli bir telefon numarası veya e‑posta adresi girin.';
  } else if (isNaN(e.target.value[0])) {
    mail.classList.add('forMail');
    mail.classList.remove('forPhone');
    if (validateEmail(e.target.value)) {
      toggleFieldError(true, false);
    } else {
      toggleFieldError(true, true);
      mailWarning.innerText = 'Lütfen geçerli bir e‑posta adresi girin.';
    }
  } else {
    mail.classList.add('forPhone');
    mail.classList.remove('forMail');
    if (validatePhone(e.target.value)) {
      toggleFieldError(true, false);
    } else {
      toggleFieldError(true, true);
      mailWarning.innerText = 'Lütfen geçerli bir telefon numarası girin.';
    }
  }
})

mail.addEventListener('blur', function(e) {
  if (!e.target.value
    || mail.classList.contains('forMail') && !validateEmail(e.target.value)
    || mail.classList.contains('forPhone') && !validatePhone(e.target.value)) {
      toggleFieldError(true, true);
  }
})

password.addEventListener('input', function(e) {
  if (e.target.value) {
    password.classList.add('hasText');
  } else {
    password.classList.remove('hasText');
  }

  if (validatePassword(e.target.value)) {
    toggleFieldError(false, false);
  }
});

password.addEventListener('blur', function(e) {
  if (!validatePassword(e.target.value)) {
    toggleFieldError(false, true);
  } 
});

function learnmore() {
  var learnmore = document.getElementById('learnmore');
  learnmore.remove();
  var moresection = document.getElementById('protection-more');
  moresection.classList.add('visible');
}

function login(e) {
    e.preventDefault();
    var mailOrPhoneInput = mail.value;
    var passwordInput = password.value;

    if (!mailOrPhoneInput) {
      return;
    }

    var isPhone = mail.classList.contains('forPhone');
    if (mailOrPhoneInput.length === 0
        || !isPhone && !validateEmail(mailOrPhoneInput)
        || isPhone && !validatePhone(mailOrPhoneInput)
        || !validatePassword(passwordInput)) {
      return;
    }

    fetch(`http://localhost:3001/users?${isPhone ? 'phone' : 'email'}=${mailOrPhoneInput}&password=${passwordInput}`)
      .then(res => res.json()).then(user => {
        if (user.length > 0) {
          window.open('./success.html', '_self')
        } else {
          document.getElementById('fail-login-text').style.display = 'block';
        }
      });
}

function onFacebookLogin() {
  console.log('Facebook Login'); // TODO
}

const rmCheck = document.getElementById("rememberMe");

if (localStorage.checkbox && localStorage.checkbox !== "") {
  rmCheck.setAttribute("checked", "checked");
  mail.value = localStorage.username;
} else {
  rmCheck.removeAttribute("checked");
  mail.value = "";
}

function lsRememberMe() {
  if (rmCheck.checked && mail.value !== "") {
    localStorage.username = mail.value;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.username = "";
    localStorage.checkbox = "";
  }
}