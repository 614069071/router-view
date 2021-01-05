require('./../../public/css/normalize.css');
require('./../../public/css/common.css');
require('./index.css');
require('./../../public/js/jquery.cookie.js');
require('./../../public/js/jquery.md5.js');
require('./../../public/js/common.js');

/* ----------- 生成NavMenu start-----------*/
function initMenuHandel() {
  var $menu_submenu_titles = $('.menu-submenu-title');
  var $menu_item_titles = $('.menu-item-title');

  $menu_submenu_titles.on('click', function () {
    var next = $(this).next();
    $(this).toggleClass('open');
    next.slideToggle();
  });

  $menu_item_titles.on('click', function () {
    $menu_item_titles.removeClass('checked');
    $(this).addClass('checked');
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
      result += '<li class="menu-item"><span class="menu-item-title" style="padding-left:' + padding + 'px;">' + e.title + '</span></li>';
    }
  }

  return result;
}

function createMenuTree(arr) {
  var result = createMenuItem(arr);
  var body = '<ul class="menu-bar-body">' + result + '</ul>';

  return body;
}

function appendMenuToEle(arr, el) {
  var root = el || $('body');
  var menuTree = createMenuTree(arr);
  root.append(menuTree);
  initMenuHandel();
}

var menuBarArray = [
  {
    title: '网络状态',
  },
  {
    title: '设备管理',
  },
  {
    title: '路由设置',
    list: [
      { title: '路由器状态' },
      { title: '设置向导' },
      { title: '上网设置' },
      { title: 'LAN口设置' },
      { title: '时间同步' },
      { title: '路由器设置' },
    ]
  },
  {
    title: '云盘操作',
  },
];

appendMenuToEle(menuBarArray);

/* ----------- 生成NavMenu end-----------*/

function initLoadView() {
  var login_status = $.cookie('LoginStatus') || false;

  if (login_status) return;
  window.location.href = '/';
}

$(function () {
  initLoadView();

  // 顶部导航栏
  function tabBarToggle(btns, views) {
    btns.on('click', function () {
      var index = $(this).index();
      btns.removeClass('active').eq(index).addClass('active');
      views.hide().eq(index).show();
    });
  }

  // 顶部导航切换
  var $nav_control_btns = $('.control-btns-left .btn');
  var $nav_control_contents = $('.control-main-wrapper .content-wrapper');
  tabBarToggle($nav_control_btns, $nav_control_contents);

  // 云盘操作导航切换
  var $yun_control_btns = $('.yun-content-inner .control-list .control-btn');
  var $yun_control_views = $('.yun-content-inner .control-content .content-item');
  tabBarToggle($yun_control_btns, $yun_control_views);

  // 路由设置导航切换
  var $setting_control_btns = $('.setting-content-inner .control-list .control-btn');
  var $setting_control_views = $('.setting-content-inner .control-content .content-item');
  tabBarToggle($setting_control_btns, $setting_control_views);

  // 退出
  var $exit = $('.exit-route-btn');
  $exit.on('click', function () {
    $.cookie('LoginStatus', false);
    initLoadView();
  });

  // 路由设置-设置向导
  var $checkTypeBtns = $('.connect-type-wrapper .check-type');
  var $connectTypeMains = $('.connect-type-main-wrapper .connect-type-item');
  $checkTypeBtns.on('change', function () {
    var index = $(this).attr('data-index');
    console.log(index);
    $connectTypeMains.removeClass('active').eq(index).addClass('active');
  });

  // 宽带拨号
  var $setting_wizard_broadband_form = $("#setting_wizard_broadband_form");
  var $setting_wizard_broadband_form_submit = $("#setting_wizard_broadband_form_submit");

  $setting_wizard_broadband_form_submit.on('click', function () {
    var form = _formArrToObject($setting_wizard_broadband_form);
    console.log(form);
  });

  // 静态ip
  var $setting_wizard_static_form = $("#setting_wizard_static_form");
  var $setting_wizard_static_form_submit = $("#setting_wizard_static_form_submit");

  $setting_wizard_static_form_submit.on('click', function () {
    var form = _formArrToObject($setting_wizard_static_form);
    console.log(form);
  });

  // 动态ip
  var $setting_wizard_dynamic_form = $("#setting_wizard_dynamic_form");
  var $setting_wizard_dynamic_form_submit = $("#setting_wizard_dynamic_form_submit");

  $setting_wizard_dynamic_form_submit.on('click', function () {
    var form = _formArrToObject($setting_wizard_dynamic_form);
    console.log(form);
  });

  // LAN口设置
  var $setting_lan_form = $("#setting_lan_form");
  var $setting_lan_submit = $("#setting_lan_submit");

  $setting_lan_submit.on('click', function () {
    var form = _formArrToObject($setting_lan_form);
    console.log(form);
  })

  // dhcp 切换显示
  var $switch_dhcp_btn = $("#switch_dhcp_btn");
  var $dhcp_wrapper = $(".dhcp-options-wrapper");
  var $dhcp_inputs = $(".dhcp-options-wrapper input");

  $switch_dhcp_btn.on('change', function () {
    var isChecked = $(this).prop('checked');
    isChecked ? $dhcp_wrapper.show() : $dhcp_wrapper.hide();
    $dhcp_inputs.val('');
  });




















});

