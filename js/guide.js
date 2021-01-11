// 设置管理密码
var $setting_route_password_btn = $('#setting_route_password_btn');
var $setting_route_password_item = $('.setting-route-password-item');
var $setting_route_internet_item = $('.setting-route-internet-item');
var $setting_route_finish_item = $('.setting-route-finish-item');

function settingPasswordNext() {
  $setting_route_password_item.hide();
  $setting_route_finish_item.hide();
  $setting_route_internet_item.show();
}

$setting_route_password_btn.click(function () {
  var newPassword = $('#setting_login_password').val();
  var confirmPassword = $('#confirm_login_password').val();
  var f = validateManagePassword('admin', newPassword, confirmPassword);
  if (!f) return;

  _login(newPassword)
    .then(function (res) {
      console.log(res)
    })
    .catch(function (err) {
      console.log(err)
    })
});

// 上网设置
var $internet_connect_select = $('.internet-connect-select');
var $internet_connect_selects = $internet_connect_select.find('.select-option');
var $internet_connect_items = $('.option-item-main');

$internet_connect_selects.click(function () {
  var $value = $(this).data('value');
  $internet_connect_items.hide().eq($value).show();
});

// 上网提交
var $setting_route_access_submit = $('#internet_access_submit');
var $setting_route_static_submit = $('#internet_static_submit');
var $setting_route_auto_submit = $('#internet_auto_submit');

function internetNext() {
  $setting_route_password_item.hide();
  $setting_route_internet_item.hide();
  $setting_route_finish_item.show();
}

$setting_route_access_submit.click(function () {
  internetNext();
});

$setting_route_static_submit.click(function () {
  internetNext();
});

$setting_route_auto_submit.click(function () {
  internetNext();
});


