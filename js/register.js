function hideText(text) {
  var hiddenText = '';
  for (var i = 0 ; i < text.length ; i ++) {
    hiddenText += '*';
  }
  return hiddenText;
}

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

//checkStatus();

$(cbshow).on('click', function() {
  //checkStatus();
});

$(password).on('keypress', function(event) {
  console.log(event.which);
  switch (event.which) {
  }
  passwordCache += String.fromCodePoint(event.which);
  console.log($(this).caret().start);
});

$(password).on('input', function() {
  passwordCache = passwordCache.substr(0, password.value.length);
  password.value = hideText(passwordCache);
});

$(confirmPw).on('input', function() {
  console.log('input');
  //checkStatus();
});
