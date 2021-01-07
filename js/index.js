// 登录权限判断
// var login_status = $.cookie('loginStatus');
// console.log(login_status)
// if (login_status) {
//   var root = $('.nav-menu-wrapper');
//   appendMenuToEle(menuBarArray, root);
// } else {
//   window.location.href = '/login.html';
// }

var menuBarArray = [
  // {
  //   title: '网络状态',
  //   module: 'network-status',
  //   checked: 1
  // },
  { title: '设置向导', module: 'route-guide', checked: 1 },
  {
    title: '路由设置',
    list: [
      { title: '路由器状态', module: 'route-status' },
      { title: 'DHCP服务器', module: 'device-manage' },
      { title: '上网设置', module: 'route-internet' },
      { title: 'LAN口设置', module: 'route-lan' },
      { title: '路由器管理', module: 'route-manage' },
      { title: '系统日志', module: 'route-log' },
    ]
  },
  {
    title: '云盘操作',
    list: [
      { title: '用户信息', module: 'cloud-userinfo' },
      { title: '磁盘操作', module: 'cloud-control' },
      { title: '应用下载', module: 'cloud-download' },
    ]
  },
];

// 创建 NavMenu
new _MenuTree(menuBarArray, $('.nav-menu-wrapper'));

// DCHP设备列表创建分页器
new _Pager($('.device-list-pager-wrapper'), {
  total: 100,
  callback: function (index) {
    console.log('device', index);
  }
});

// 系统日志 分页器
new _Pager($('.roter-log-pager-wrapper'), {
  total: 100,
  callback: function (index) {
    console.log('log', index);
  }
});

/* 主体功能模块 */
// 路由设置 => 上网设置
var $connectRadioBtns = $('.connect-type-wrapper .check-type');
var $connectModels = $('.connect-type-main-wrapper .model-type-item');

// tab切换
$connectRadioBtns.on('change', function () {
  var $index = $(this).data('index');
  $connectModels.hide().eq($index).show();
});

// lan设置
var $lanRadios = $('#setting_lan_form .check-type');
var $lanTypeItems = $('#setting_lan_form .lan-type-item');

$lanRadios.on('change', function () {
  var $index = $(this).data('index');
  $lanTypeItems.hide().eq($index).show();
});

// 设备管理 => 修改管理密码
var $setting_manage_form = $('#setting_manage_form');
var $setting_manage_form_submit = $('#setting_manage_form_submit');

$setting_manage_form_submit.on('click', function () {
  var data = _formArrToObject($setting_manage_form);
  updateManagePassword(data.oldPassword, data.newPassword, data.confirmPassword);
});

// 设备管理 => 固件升级
var $update_file = $('#update_file');
var $upgrade_submit = $('#upgrade_submit');
var $progressBarwrapper = $('.progress-bar-wrapper');
var $upgrade_name = $('.upgrade-name');
var upgrade_Progress = null;

$update_file.on('change', function (e) {
  var file = e.target.files[0] || {};
  var name = file.name;
  name && $upgrade_name.text(name);
})

$upgrade_submit.on('click', function () {
  // upgrade_Progress = new _Progress($progressBarwrapper, 30)
  // upgrade_Progress.start();

  var $file = $update_file.prop('files')[0];
  console.log($file)
  uploadFile($file);
})

// 设备管理 => 重启
var $restartDeviceBtn = $('#restart_device_btn');

$restartDeviceBtn.on('click', function () {
  _dialog({
    success: function () {
      restartRoute();
      // _close();
    }
  });
});

// 设备管理 => 恢复出厂设置
var $restoreDeviceBtn = $('#restore_device_btn');

$restoreDeviceBtn.on('click', function () {
  _dialog({
    success: function () {
      // restoreRoute();
      // _close();
    }
  });
});