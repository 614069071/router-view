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

// 恢复出厂设置
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

// 获取时间
function _getTimeSync() {
  var parmas = { operation: 'time_sync', function: 'get', server: '' };

  return _request(parmas);
}

// lan口设置 获取DHCP信息
function _getLanInfo() {
  var parmas = { operation: 'dhcpd', function: 'get' };

  return _request(parmas);
}

//  lan口设置 => 设置lan口信息
function _setLanInfo() {
  var parmas = {
    operation: 'dhcpd',
    function: 'set',
    start: '',//开始区间
    end: '',//结束区间
    mask: '',//子网掩码
    ip: ip,
    enable: 1,//是否打开
    dns1: '',
    dns2: '',
    ip_limit: '',
    ip_startthird: '',
  };

  return _request(parmas);
}

// lan口设置 => 获取dhcp设备列表
function _getOlineList() {
  var parmas = { operation: 'get_host', function: 'get' };

  return _request(parmas);
}

// wan口设置 设置dhcp
function _setConnectDhcp(dns, mac, mtu) {
  var parmas = {
    operation: 'wan_setup',
    function: 'set',
    mode: 1,
    dns: dns,
    mac: mac,
    mtu: mtu
  };

  return _request(parmas);
}

// 宽带拨号
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
function _setConnectStatic(ip, mask, gw, dns, dns1, mac, mtu) {
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

// 软件升级 => 上传文件
function _uploadFile(file) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'upload');
  formData.append('function', 'upgrade');

  return _request(formData);
  // 上传完成，开始升级
  // _upgradeStart();
}

//  软件升级 => 升级
function _upgradeStart() {
  var parmas = { type: 'mtd_write', function: 'upgrade' };

  return _request(parmas);
}