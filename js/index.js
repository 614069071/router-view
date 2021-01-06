// 登录权限判断
// var login_status = $.cookie('loginStatus');
// console.log(login_status)
// if (login_status) {
//   var root = $('.nav-menu-wrapper');
//   appendMenuToEle(menuBarArray, root);
// } else {
//   window.location.href = '/login.html';
// }

// 创建 NavMenu
var menuBarArray = [
  {
    title: '网络状态',
    module: 'network-status',
    checked: 1
  },
  {
    title: '设备管理',
    module: 'device-manage'
  },
  {
    title: '路由设置',
    list: [
      { title: '路由器状态', module: 'route-status' },
      { title: '设置向导', module: 'route-guide' },
      { title: '上网设置', module: 'route-internet' },
      { title: 'LAN口设置', module: 'route-lan' },
      { title: '路由器管理', module: 'route-manage' },
      { title: '系统日志', module: 'route-log' },
    ]
  },
  {
    title: '云盘操作',
    list: [
      { title: '用户信息' },
      { title: '磁盘操作' },
      { title: '应用下载' },
    ]
  },
];

new _MenuTree(menuBarArray, $('.nav-menu-wrapper'));

// 创建分页器
new _Pager($('.pager-view-wrapper-test'), {
  total: 100,
  callback: function (index) {
    console.log('current', index);
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