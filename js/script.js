function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function validatePhone(phone) {
  return phone.length > 4; // ?
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

const users = [
  {
    email: 'denizcalkan@hotmail.com',
    phone: '05553332222',
    password: 'deniz'
  },
  {
    email: 'munevveruslukilic@hotmail.com',
    phone: '05552223333',
    password: 'munevver'
  }
];

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

    var validUser = users.some(function(user) {
      var { email, phone, password } = user;
      if (isPhone) {
        return phone === mailOrPhoneInput && password === passwordInput;
      }
      return email === mailOrPhoneInput && password === passwordInput;
    });

    if (validUser) {
      window.open('./success.html', '_self')
    } else {
      alert('There is no user with the given credentials!')
    }
}

function onFacebookLogin() {
  console.log('Facebook Login'); // TODO
}