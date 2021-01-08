// 登录
function _login(password) {
  var str_md5 = $.md5('root' + password);
  var parmas = { operation: 'login', function: 'set', usrid: str_md5 };

  return _request(parmas);
}

// 设置向导
function _setStaticConfigWizard() {

}

// 获取日志
function _getSystemLog() {
  var parmas = { operation: 'sys_log', function: 'get' };
  var url = "http://" + document.domain + "/cgi-bin/log.sh";

  return _request(parmas, 'post', url);
}

// 修改管理密码
function updateManagePassword(oldPaswword, newPassword, confirmPassword, callback) {
  var oldPaswword = _trim(oldPaswword);
  var newPassword = _trim(newPassword);
  var confirmPassword = _trim(confirmPassword);

  if (!oldPaswword) {
    _toast('请输入旧密码');
    return;
  }

  if (!newPassword) {
    _toast('请输入新密码');
    return;
  }

  var reg = /[\':;*?~`!@#$%^&+={}\[\]\<\\(\),\.\。\，]/;
  if (newPassword.indexOf("%u") != -1 || reg.test(newPassword)) {
    _toast('密码不能包含中文字符或者特殊字符！');
    return;
  }

  if (newPassword.length < 5 || newPassword.length > 15) {
    _toast('请输入5-15位新密码');
    return;
  }

  if (!confirmPassword) {
    _toast('请再次输入确认密码');
    return;
  }

  if (newPassword != confirmPassword) {
    _toast('两次密码不一致');
    return;
  }

  // 验证旧密码
  return _login(oldPaswword);
  // setAccount 修改管理密码
}

// 修改管理密码
function setAccount(password) {
  var modfiy_parmas = { operation: 'login_modfiy', user: 'admin', password: password };

  return _request(modfiy_parmas)
}

// 固件升级
function uploadFile(file) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'upload');
  formData.append('function', 'upgrade');

  return _request(formData)
  // getUpdateFileStatus();// 获取升级状态
}

// 获取升级返回状态
function getUpdateFileStatus() {
  var parmas = { type: 'mtd_write', function: 'upgrade' };

  return _request(parmas)
}

// 重启路由器
function restartRoute() {
  var params = { operation: 'device_opt', action: 'reboot' };

  return _request(params);
}

// 恢复出厂设置
function restoreRoute() {
  var params = { operation: 'device_opt', action: 'default' };

  return _request(params);
}