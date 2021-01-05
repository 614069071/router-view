/* ------------------- 创建 NavMenu start ------------------- */
function initMenuHandel() {
  var $menu_submenu_titles = $('.menu-submenu-title');
  var $menu_item_titles = $('.menu-item-title');

  $menu_submenu_titles.on('click', function () {
    var next = $(this).next();
    next.slideToggle();
    $(this).toggleClass('open');
  });

  $menu_item_titles.on('click', function () {
    $menu_item_titles.removeClass('checked');
    $(this).addClass('checked');

    // 获取对应模块
    var $module = $(this).data('module') || '';
    var $modules = $('.module-item-wrapper');
    $modules.hide();
    var $content = $('.module-item-wrapper[data-module="' + $module + '"]');
    $content.show();
    // console.log($content);
  });
}

function createMenuItem(arr, pl) {
  var result = '';
  var padding = pl || 20;
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var e = arr[i];
    if (e.list && e.list.length) {
      var nextNode = createMenuItem(e.list, padding + 10);
      result += '<li class="menu-submenu"><span class="menu-submenu-title" style="padding-left:' + padding + 'px;">' + e.title + '<i class="icon-arrow"></i></span><ul class="menu-submenu-body">' + nextNode + '</ul></li>';
    } else {
      result += '<li class="menu-item"><span class="menu-item-title ' + (e.checked ? "checked" : "") + '" data-module="' + e.module + '" style="padding-left:' + padding + 'px;">' + e.title + '</span></li>';
    }
  }

  return result;
}

function createMenuTree(arr) {
  var result = createMenuItem(arr);
  var body = '<ul class="menu-bar-body">' + result + '</ul>';

  return body;
}

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

function appendMenuToEle(arr, el) {
  var root = el || $('body');
  var menuTree = createMenuTree(arr);
  root.append(menuTree);
  initMenuHandel();
}

// 登录权限判断
// var login_status = $.cookie('loginStatus');
// console.log(login_status)
// if (login_status) {
//   var root = $('.nav-menu-wrapper');
//   appendMenuToEle(menuBarArray, root);
// } else {
//   window.location.href = '/login.html';
// }

var root = $('.nav-menu-wrapper');
appendMenuToEle(menuBarArray, root);
/* ------------------- 创建 NavMenu start ------------------- */

/* 主体功能模块 */
// 路由设置 => 上网设置
var $connectRadioBtns = $('.connect-type-wrapper .check-type');
var $connectModels = $('.connect-type-main-wrapper .model-type-item');
console.log($connectModels)
// tab切换
$connectRadioBtns.on('change', function () {
  var $index = $(this).data('index');
  $connectModels.hide().eq($index).show();
})