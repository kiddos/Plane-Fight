function hideText(text) {
  var hiddenText = '';
  for (var i = 0 ; i < text.length ; i ++) {
    hiddenText += '*';
  }
  return hiddenText;
}

String.prototype.insert = function(text, pos) {
  return this.substring(0, pos) + text + this.substring(pos);
};

var password = document.getElementById('password');
var confirmPw = document.getElementById('confirm');
var cbshow = document.getElementById('show');
var passwordCache = '';
var confirmPwCache = '';

function checkStatus() {
  if (!cbshow.checked) {
    password.value = hideText(password.value);
    confirmPw.value = hideText(password.value);
  } else {
    password.value = passwordCache;
    confirmPw.value = confirmPwCache;
  }
}

$(cbshow).on('click', function() {
  //checkStatus();
});

var pwpos = 0;
$(password).on('keypress', function(event) {
  //console.log(event.which);
  var ch = String.fromCharCode(event.which);
  pwpos = $(this).caret();

  passwordCache = passwordCache.insert(ch, pwpos);
});

$(password).on('input', function() {
  passwordCache = passwordCache.substr(0, password.value.length);
  password.value = hideText(passwordCache);
  $(this).caret(pwpos+1);
});

var cfpos = 0;
$(confirmPw).on('keypress', function(event) {
  var ch = String.fromCharCode(event.which);
  cfpos = $(this).caret();

  confirmPwCache = confirmPwCache.insert(ch, cfpos);
  console.log(confirmPwCache);
});

$(confirmPw).on('input', function() {
  confirmPwCache = confirmPwCache.substr(0, confirmPw.value.length);
  confirmPw.value = hideText(confirmPwCache);
  $(this).caret(cfpos+1);
});

