// 登录(校验密码)
function _login(password) {
  var str_md5 = $.md5('root' + password);
  var parmas = { operation: 'login', function: 'set', usrid: str_md5 };

  return _request(parmas);
}

// 获取日志
function _getSystemLog() {
  var parmas = { operation: 'sys_log', function: 'get' };
  var url = "http://" + document.domain + "/cgi-bin/log.sh";

  return _request(parmas, 'post', url);
}

// 校验管理密码
function validateManagePassword(oldPaswword, newPassword, confirmPassword) {
  var oldPaswword = _trim(oldPaswword);
  var newPassword = _trim(newPassword);
  var confirmPassword = _trim(confirmPassword);

  if (!oldPaswword) {
    _toast('请输入旧密码');
    return false;
  }

  if (!newPassword) {
    _toast('请输入新密码');
    return false;
  }

  var reg = /[\':;*?~`!@#$%^&+={}\[\]\<\\(\),\.\。\，]/;
  if (newPassword.indexOf("%u") != -1 || reg.test(newPassword)) {
    _toast('密码不能包含中文字符或者特殊字符！');
    return false;
  }

  if (newPassword.length < 5 || newPassword.length > 15) {
    _toast('请输入5-15位新密码');
    return false;
  }

  if (!confirmPassword) {
    _toast('请再次输入确认密码');
    return false;
  }

  if (newPassword != confirmPassword) {
    _toast('两次密码不一致');
    return false;
  }
  return true;
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

// 宽带拨号
function setConnectPPPoE(account, password) {
  var params = {
    operation: "wan_setup_wizard",
    function: "set",
    user: account,//待确认
    passwd: password,//待确认
    mode: 2,
    mtu: '1480',//宽带1480 自动和静态1500
    dns: '',
    dns1: '',
    mac: '',
    pppoe_server: '',
    math: Math.random()
  };

  return _request(params);
}

// 获取路由信息
function getRouterInfo() {
  var parmas = { operation: 'route_info', function: 'get' };

  return _request(parmas);
}

// 获取时间
function getTimeSync() {
  var parmas = { operation: 'time_sync', function: 'get', server: '' };

  return _request(parmas);
}

// 获取设备列表
function getOlineList() {
  var parmas = { operation: 'get_host', function: 'get' };

  return _request(parmas);
}

// 设置静态IP
function setConnectStatic(ip, mask, gw, dns, dns1, mac, mtu) {
  var parmas = {
    operation: 'wan_setup',
    function: 'set',
    ip: ip,
    mask: mask,
    gw: gw,
    mode: 3,
    mtu: mtu,
    dns: dns,
    dns1: dns1,
    mac: mac,
  };

  return _request(parmas);
}