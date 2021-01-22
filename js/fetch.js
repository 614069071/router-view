// 登录(校验密码)
function _login(password) {
  var str_md5 = $.md5('root' + password);
  var parmas = { operation: 'login', function: 'set', usrid: str_md5 };

  return _request(parmas);
}

// 修改管理密码
function _setAccount(password) {
  var modfiy_parmas = { operation: 'login_modfiy', user: 'admin', password: password };

  return _request(modfiy_parmas)
}

// 重启路由器
function _restartRoute() {
  var params = { operation: 'device_opt', action: 'reboot' };

  return _request(params);
}

// 恢复出厂设置(重置)
function _restoreRoute() {
  var params = { operation: 'device_opt', action: 'default' };

  return _request(params);
}

// 首页获取路由信息
function _getRouterInfo() {
  var parmas = { operation: 'route_info', function: 'get' };

  return _request(parmas);
}

// 获取设备状态信息（）
function _getDeviceInfo() {
  var parmas = { operation: 'dev_info', function: 'get' };

  return _request(parmas);
}

// lan口设置 获取DHCP信息
function _getLanInfo() {
  var parmas = { operation: 'dhcpd', function: 'get' };

  return _request(parmas);
}

//  lan口设置 => 设置lan口信息
function _setLanInfo(parmas) {
  return _request(parmas);
}

// lan口设置 => 获取dhcp设备列表
function _getOlineList() {
  var parmas = { operation: 'get_host', function: 'get' };

  return _request(parmas);
}

// wan口设置 设置dhcp
function _setConnectDhcp() {
  var parmas = {
    operation: 'wan_setup',
    function: 'set',
    mode: 1,
  };

  return _request(parmas);
}

// wan口设置 宽带拨号
function _setConnectPPPoE(account, password) {
  var params = {
    operation: "wan_setup",
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

// 设置静态IP
function _setConnectStatic(parmas) {
  return _request(parmas);
}

// 软件升级 => 上传文件
function _uploadFile(file) {
  var formData = new FormData();
  formData.append('file', file);

  var url = _action + '?type=upload&function=upgrade';

  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'post',
      url: url,
      timeout: 3000,
      data: formData,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
      complete: function (xhr) {
        xhr.abort();
        _close();
      }
    });
  });
}

//  软件升级 => 升级
function _upgradeStart() {
  var url = _action + '?type=mtd_write&function=upgrade';

  return _request({}, 'post', url);
}

// 检测版本（测试接口，无效）
function _detectionVersion() {
  var parmas = {};

  return _request(parmas);
}