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

// 创建分页器
new _Pager($('.device-list-pager-wrapper'), {
  total: 100,
  callback: function (index) {
    console.log('device', index);
  }
});

// 创建分页器
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

// 设备管理 => 固件升级
var $upgrade_submit = $('#upgrade_submit');
var $upgrade_submit2 = $('#upgrade_submit2');
var $progressBarwrapper = $('.progress-bar-wrapper');
var upgrade_Progress = null;

$upgrade_submit.on('click', function () {
  upgrade_Progress = new _Progress($progressBarwrapper, 30)
  upgrade_Progress.start();
})

$upgrade_submit2.on('click', function () {
  upgrade_Progress.finish();

})

