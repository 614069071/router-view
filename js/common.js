// 请求地址
window._action = "/cgi-bin/cdata.cgi";
window._guide = -1;  // guide  = 0 when checkconfig(),else guide = 1 when click menu .a

// 禁止右键
function disEvent() {
  document.ondragstart = function () { return false };
  document.onbeforecopy = function () { return false };
  document.onselectstart = function () { return false };
  document.oncontextmenu = function () { return false };
  document.oncopy = function () { document.selection && document.selection.empty(); };
  document.onselect = function () { document.selection && document.selection.empty(); };
  document.onmouseup = function () { document.selection && document.selection.empty(); }
}

// disEvent();

// switch组件交互
var $allSwitchBtns = $("input[role='switch']");
$allSwitchBtns.on('change', function () {
  var isChecked = $(this).prop('checked');
  var parent = $(this).parent();
  isChecked ? parent.addClass('on') : parent.removeClass('on');
});

var $allRadioBtns = $("input[type=radio]");
$allRadioBtns.on('change', function () {
  var name = $(this).prop('name');
  var list = $('input[name=' + name + ']');
  list.parent().removeClass('on');
  $(this).parent().toggleClass('on');
});

// 设置所有input元素的autocomplete属性
var $inputTypeTexts = $('input');
$inputTypeTexts.prop('autocomplete', 'off');


/* -------------------创建分页器 start -------------------*/
window._Pager = function (root, options) {
  this.root = root || $('body');
  this.cache = 0;
  this.addPage = 0;
  this.current = 1; //当前索引
  this.total = options.total; //总数凉条数
  this.size = options.size || 10; //分页条数
  this.step = options.step || 8; //显示条数
  this.callback = options.callback || function () { }

  this.init(root);
}

_Pager.prototype.switch = function (type) {
  if (type === 'left') {
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

_Pager.prototype.select = function (item) {
  this.current = item;
  var index = item + this.addPage;
  this.callback(index);
};

_Pager.prototype.create = function () {
  var self = this;
  var items = new Array(this.cache);

  $.each(items, function (i) {
    var item = $('<span class="pager-item ' + (self.current === (i + 1) ? 'active' : '') + '">' + (i + 1 + self.addPage) + '</span>');
    item.on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      self.select(i + 1);
    });
    items[i] = item;
  })

  return items;
}

_Pager.prototype.update = function () {
  var $el = this.root.find('.pager-body');
  var items = this.create();

  $el.empty().append(items);
}

_Pager.prototype.init = function () {
  var self = this;
  // 创建分页数量
  var num = Math.ceil(this.total / this.size);

  this.cache = num >= this.step ? this.step : num;

  var $wrapper = $('<div class="pager-view-wrapper right"></div>');
  var $leftBtn = $('<div class="pager-btn"><i class="icon-arrow-left"></i></div>');
  $leftBtn.on('click', function () {
    self.switch('left');
    self.update();
  })

  var $rightBtn = $('<div class="pager-btn"><i class="icon-arrow-right"></i></div>');
  $rightBtn.on('click', function () {
    self.switch('right');
    self.update();
  })

  var $pagerBody = $('<div class="pager-body"></div>');
  var $items = this.create();

  $pagerBody.append($items);
  $wrapper.append($leftBtn);
  $wrapper.append($pagerBody);
  $wrapper.append($rightBtn);

  this.root.append($wrapper);
}
/* -------------------创建分页器 end -------------------*/

/* ------------------- 创建 NavMenu start ------------------- */
window._MenuTree = function (arr, el) {
  this.appendMenuToEle(arr, el);
}

_MenuTree.prototype.initMenuHandel = function () {
  var $menu_submenu_titles = $('.menu-submenu-title');
  var $menu_item_titles = $('.menu-item-title');

  $menu_submenu_titles.on('click', function () {
    var other = $(this).parent().siblings();
    other.children('.menu-submenu-body').slideUp();
    other.children('.menu-submenu-title').removeClass('open');
    $(this).toggleClass('open').next().slideToggle();
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
  });
}

_MenuTree.prototype.createMenuItem = function (arr, pl) {
  var result = '';
  var padding = pl || 20;
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var e = arr[i];
    if (e.list && e.list.length) {
      var nextNode = this.createMenuItem(e.list, padding + 10);
      result += '<li class="menu-submenu"><span class="menu-submenu-title" style="padding-left:' + padding + 'px;">' + e.title + '<i class="icon-arrow-top"></i></span><ul class="menu-submenu-body">' + nextNode + '</ul></li>';
    } else {
      result += '<li class="menu-item"><span class="menu-item-title ' + (e.checked ? "checked" : "") + '" data-module="' + e.module + '" style="padding-left:' + padding + 'px;">' + e.title + '</span></li>';
    }
  }

  return result;
}

_MenuTree.prototype.createMenuTree = function (arr) {
  var result = this.createMenuItem(arr);
  var body = '<ul class="menu-bar-body">' + result + '</ul>';

  return body;
}

_MenuTree.prototype.appendMenuToEle = function (arr, el) {
  var root = el || $('body');
  var menuTree = this.createMenuTree(arr);
  root.append(menuTree);
  this.initMenuHandel();
}
/* ------------------- 创建 NavMenu end ------------------- */


// 进度条
function _Progress(el, count) {
  this.el = el || $('body');//挂载点
  this.count = count || 120;//时长 s
  this.timer = null;
  this.create();
}

_Progress.prototype.create = function () {
  var $wrapper = $('<div class="progress-wrapper"><div class="progress-inner"></div></div>');
  this.el.empty().append($wrapper);
}

_Progress.prototype.start = function () {
  var self = this;
  self.timer && clearInterval(self.timer);
  var $wrapper = self.el.find('.progress-wrapper');
  var $inner = self.el.find('.progress-inner');
  console.log($inner)
  var $width = $wrapper.width();

  var step = $width / self.count;
  var current = 0;

  self.timer = setInterval(function (callback) {
    current += step;
    if (current >= $width) {
      current = $width;
      clearInterval(self.timer);
      callback && callback();
      $inner.animate({ width: current + 'px' }, 1000, 'linear', function () {
        self.el.children().fadeOut(1000, function () {
          $(this).remove();
        })
      });
    } else {
      $inner.animate({ width: current + 'px' }, 1000, 'linear');
    }
  }, 1000);
}

_Progress.prototype.finish = function (callback) {
  var self = this;
  clearInterval(self.timer);
  var $wrapper = self.el.find('.progress-wrapper');
  var $inner = self.el.find('.progress-inner');
  var $width = $wrapper.width();
  $inner.animate({ width: $width + 'px' }, 1000, 'linear', function () {
    clearInterval(self.timer);
    self.el.children().fadeOut(1000, function () {
      $(this).remove();
    })
    callback && callback();
  });
}
