// 登录
var $loginSubmitBtn = $('#login_submit');
var $loginSubmitInput = $('#login_password');
var $psErrorTip = $('#ps_error_tip');

function loginHandel() {
  var value = $loginSubmitInput.val();

  if (value) {
    $.cookie('LoginStatus', true);
    _login(value)
      .then(function (res) {

      })
      .cache(function (err) {

      })
  } else {
    // $psErrorTip.show().html('请输入密码');
    _toast('请输入密码');
  }
}

$(function () {
  // 登录模块
  $loginSubmitBtn.on('click', function () {
    loginHandel();
  });

  $loginSubmitInput.on('keyup', function (event) {
    var e = event || window.event || {};
    if (e.keyCode == 13) {
      loginHandel();
    }
  });

  // 忘记密码弹窗显隐 - 按钮控制
  var $forgotBtn = $('#forgot_password_btn');
  var $forgotTip = $('#forgot_tips');
  $forgotBtn.on('click', function () {
    $forgotTip.toggle();
  });

});

