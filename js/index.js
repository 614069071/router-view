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
      result += '<li class="menu-submenu"><span class="menu-submenu-title" style="padding-left:' + padding + 'px;">' + e.title + '<i class="icon-arrow-top"></i></span><ul class="menu-submenu-body">' + nextNode + '</ul></li>';
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


/* -------------------创建分页器 start -------------------*/
function Pager(total, size, step, callback) {
  this.total = total;//总数凉条数
  this.size = size || 10;//分页条数
  this.step = step || 5;//显示条数
  this.current = 1;//当前索引
  this.cache = 0;//
  this.addPage = 0;//
  this.callback = callback || function () { }
}

Pager.prototype.switchPage = function (type) {
  if (type) {
    if (this.current === 1 && !this.addPage) return;
    if (this.current <= 1) {
      if (this.addPage) {
        this.addPage--;
      }
    } else {
      this.current--;
    }
  } else {
    if (this.current >= this.cache) {
      var num = Math.ceil(this.total / this.size);
      if (this.addPage >= num - this.step) return;
      this.addPage++;
    } else {
      this.current++;
    }
  }

  var currentPage = this.current + this.addPage;

  this.callback(currentPage);
};

Pager.prototype.checked = function (item) {
  this.current = item;
  var index = item + this.addPage;
  this.callback(index);
};

Pager.prototype.create = function () {
  var items = [];
  var self = this;

  for (let i = 0; i < this.cache; i++) {
    var item = $('<span class="pager-item ' + (this.current === (i + 1) ? 'active' : '') + '">' + (i + 1 + this.addPage) + '</span>');
    item.on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      self.checked(i + 1);
    });
    items.push(item);
  }

  return items;
}

Pager.prototype.update = function () {
  var $el = $('.pager-body');
  var items = this.create();

  $el.empty().append(items);
}

Pager.prototype.init = function (root) {
  var self = this;
  // 创建分页数量
  var num = Math.ceil(this.total / this.size);

  this.cache = num >= this.step ? this.step : num;

  console.log(this.cache, 'this.cache')

  var root = root || $('body');
  var $wrapper = $('<div class="pager-view-wrapper right"></div>');
  var $leftBtn = $('<div class="pager-btn"><i class="icon-arrow-left"></i></div>');
  $leftBtn.on('click', function () {
    self.switchPage(1);
    self.update();
  })

  var $rightBtn = $('<div class="pager-btn"><i class="icon-arrow-right"></i></div>');
  $rightBtn.on('click', function () {
    self.switchPage(0);
    self.update();
  })

  var $pagerBody = $('<div class="pager-body"></div>');
  var $items = this.create();

  console.log($items, '$items')

  $pagerBody.append($items);
  console.log($pagerBody, '$pagerBody')
  $wrapper.append($leftBtn);
  $wrapper.append($pagerBody);
  $wrapper.append($rightBtn);

  root.append($wrapper);
}

var pager = new Pager(100, 10, 8, function (index) {
  console.log('current', index);
});
var el = $('.pager-view-wrapper-test');
pager.init(el);

console.log(pager, 'pager')

/* -------------------创建分页器 end -------------------*/


/* 主体功能模块 */
// 路由设置 => 上网设置
var $connectRadioBtns = $('.connect-type-wrapper .check-type');
var $connectModels = $('.connect-type-main-wrapper .model-type-item');

// tab切换
$connectRadioBtns.on('change', function () {
  var $index = $(this).data('index');
  $connectModels.hide().eq($index).show();
});