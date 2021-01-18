// 请求地址
window._action = "http://" + document.domain + "/cgi-bin/cdata.cgi";
window._guide = -1; // guide  = 0 when checkconfig(),else guide = 1 when click menu .a

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

disEvent();

window._init = function () {

  // switch组件交互
  var $allSwitchBtns = $("input[role='switch']");
  $allSwitchBtns.on('change', function () {
    var isChecked = $(this).prop('checked');
    var parent = $(this).parent();
    isChecked ? parent.addClass('on') : parent.removeClass('on');
  });

  // 单选框
  var $allRadioBtns = $("input[type=radio]");
  $allRadioBtns.on('change', function () {
    var name = $(this).prop('name');
    var list = $('input[name=' + name + ']');
    list.parent().removeClass('on');
    $(this).parent().toggleClass('on');
  });

  // 下拉框
  var $allSelectChecks = $('.select-checked');
  var $allSelectOptions = $('.select-option');

  $allSelectChecks.on('click', function (e) {
    var $next = $(this).next();
    $(this).toggleClass('open');
    $next.stop(true).slideToggle();
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  $allSelectOptions.on('click', function (e) {
    var $value = $(this).data('value');
    var $text = $(this).text();
    var $check = $(this).parent().prev();
    var $parent = $(this).parent();
    $parent.slideUp();
    $(this).addClass('active').siblings().removeClass('active');
    $check.toggleClass('open').data('value', $value).children('span').text($text);
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  $('body').on('click', function (e) {
    $('.select-options').slideUp().prev().removeClass('open');
  });

  // 设置所有input元素的autocomplete属性
  var $inputTypeTexts = $('input');
  $inputTypeTexts.prop('autocomplete', 'off');
}


/* -------------------创建分页器 start -------------------*/
function _Pager(root, options) {
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
  var $leftBtn = $('<div class="pager-btn"><i class="iconfont icon-arrow-left"></i></div>');
  $leftBtn.on('click', function () {
    self.switch('left');
    self.update();
  })

  var $rightBtn = $('<div class="pager-btn"><i class="iconfont icon-arrow-right"></i></div>');
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
function _MenuTree(arr, el, complete) {
  this.appendMenuToEle(arr, el);
  this.complete = complete;
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
    $modules.hide().removeClass('active');
    var $content = $('.module-item-wrapper[data-module="' + $module + '"]');
    $content.show().addClass('active');

    _storages.set('_module_', $module);
  });
}

_MenuTree.prototype.createMenuItem = function (arr, el, pl) {
  var result = el || $('<ul class="menu-bar-body"></ul>')
  var padding = pl || 20;
  var self = this;

  $.each(arr, function (i, e) {
    var item = null;
    if (e.list && e.list.length) {
      var ul = $('<ul class="menu-submenu-body"></ul>');
      var nextNode = self.createMenuItem(e.list, ul, padding + 10);
      var item = $('<li class="menu-submenu"><span class="menu-submenu-title" style="padding-left:' + padding + 'px;">' + (e.icon ? '<i class="iconfont icon-' + e.icon + '"></i>' : '') + e.title + '<i class="submenu-arrow iconfont icon-arrow-down"></i></span></li>');
      ul.append(nextNode);
      item.append(ul);
    } else {
      var span = $('<span class="menu-item-title ' + (e.checked ? "checked" : "") + '" data-module="' + e.module + '" style="padding-left:' + padding + 'px;">' + (e.icon ? '<i class="iconfont icon-' + e.icon + '"></i>' : '') + e.title + '</span>');

      span.on('click', function () {
        self.complete && self.complete();
        e.callback && e.callback();
      });

      item = $('<li class="menu-item"></li>');
      item.append(span);
    }

    result.append(item);

  });

  return result;
}

_MenuTree.prototype.appendMenuToEle = function (arr, el) {
  var root = el || $('body');
  var menuTree = this.createMenuItem(arr);
  root.append(menuTree);
  this.initMenuHandel();
  this.finish();
}

_MenuTree.prototype.finish = function () {
  var $menu_item_titles = $('.menu-item-title');
  var _fistModule_ = $menu_item_titles.eq(0).data('module');
  var _module_ = _storages.get('_module_') || _fistModule_;
  var $content = $('.module-item-wrapper');

  $menu_item_titles.each(function (i, e) {
    var $module = $(e).data('module') || '';
    if ($module === _module_) {
      $menu_item_titles.removeClass('checked');
      $(e).addClass('checked');
      $content.hide().removeClass('active').eq(i).show().addClass('active');
    }
  });
}
/* ------------------- 创建 NavMenu end ------------------- */


// 进度条
function _Progress(el, count) {
  this.el = el || $('body'); //挂载点
  this.count = count || 600; //时长 s
  this.timer = null;
  this.current = 0;
  this.create();
}

_Progress.prototype.create = function () {
  var $wrapper = $(`
  <div class="progress-wrapper">
    <span class="progress-percentage">0%</span>
    <svg viewBox="0 0 100 100">
      <path d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94" stroke="#e5e9f2" stroke-width="4.8"
        fill="none" style="stroke-dasharray: 295.31px, 295.31px;"></path>
      <path class="progress-bar" d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94"
        stroke="#20a0ff" stroke-width="4.8" fill="none" style="stroke-dasharray: 0px, 295.31px;">
      </path>
    </svg>
  </div>`);
  this.el.empty().append($wrapper);
}

_Progress.prototype.move = function (num) {
  var el = document.querySelector('.progress-wrapper');
  if (!el) this.create();
  var self = this;
  var sum = 295.31;
  var step = sum / 100;
  var speed = num || self.count;
  var $progress_bar = $('.progress-wrapper .progress-bar');
  var $progress_percentage = $('.progress-wrapper .progress-percentage');

  self.timer = setInterval(function () {
    self.current += 1;
    var scale = self.current + '%';
    console.log(self.current, 'self.current');
    $progress_percentage.text(scale);
    $progress_bar.prop('style', 'stroke-dasharray: ' + (self.current * step) + 'px, 295.31px;');
    if (self.current >= 100) {
      clearInterval(self.timer);
    }
  }, speed);
}

_Progress.prototype.start = function () {
  var self = this;

  this.move();

  if (this.current >= 99) {
    clearInterval(self.timer);
  }
}

_Progress.prototype.finish = function () {
  clearInterval(this.timer);
  this.move(100);
}

_Progress.prototype.close = function () {
  clearInterval(self.timer);
}

/* 
  @text 弹窗文字
  @awit 延迟时间
  return el
*/
function _toast(text, type, callback) {
  var type = type || 'success';
  var ie = '';
  if (type === 'error') {
    ie = '<i class="toast-icon iconfont icon-error"></i>';
  } else if (type === 'warning') {
    ie = '<i class="toast-icon iconfont icon-warning"></i>';
  } else {
    ie = '<i class="toast-icon iconfont icon-success"></i>';
  }
  var elToast = document.querySelector('.toast-wrapper');

  if (elToast) $(elToast).remove();

  var $el = $('<div class="toast-wrapper ' + type + '"><div class="toast-inner">' + ie + (text || 'toast') + '</div></div>');

  $('body').append($el);

  $el.fadeIn(200).delay(3000).fadeOut(function () {
    $el.remove();
    callback && callback();
  });
}

// loading
function _loading(text) {
  var elLoading = document.querySelector('.loading-wrapper');

  if (elLoading) $(elLoading).remove();
  var content = text ? '<span class="loading-text"></span>' + text + '</span>' : '';
  var $el = $('<div class="loading-wrapper"><span class="icon-loading"></span>' + content + '</div>');

  $('body').append($el);
}

function _dialog(options, flag) {
  var options = options || {};
  var el = document.querySelector('.dialog-wrapper');

  if (el) $(el).remove();

  var icon = '';
  if (options.icon === 'success') {
    icon = '<i class="iconfont icon-success"></i>';
  } else if (options.icon === 'error') {
    icon = '<i class="iconfont icon-error"></i>';
  } else if (options.icon === 'warning') {
    icon = '<i class="iconfont icon-warning"></i>';
  } else {
    icon = '';
  }

  var wrapper = $('<div class="dialog-wrapper"></div>');
  var inner = $('<div class="dialog-inner"></div>');
  var title = $('<div class="dialog-title">' + (options.title || '提示') + '</div>');
  var close = $('<i class="dialog-close iconfont icon-close"></i>');
  var main = $('<div class="dialog-main">' + icon + (options.content || '') + '</div>');
  var btns = $('<div class="dialog-btns"></div>');
  var cancel = $('<button class="button info">' + (options.cancelText || "取消") + '</button>');
  var success = $('<button class="button">' + (options.successText || "确定") + '</button>');

  close.on('click', function () {
    _close();
    options.cancel && options.cancel();
  });

  cancel.on('click', function () {
    _close();
    options.cancel && options.cancel();
  });

  success.on('click', function () {
    options.success && options.success(_close);
  });

  title.append(close);
  inner.append(title);
  inner.append(main);
  if (!flag) {
    btns.append(cancel);
    btns.append(success);
    inner.append(btns);
  }
  wrapper.append(inner);

  $('body').append(wrapper);
}

// 关闭所有弹窗
function _close() {
  var elToast = document.querySelector('.toast-wrapper');
  var elLoading = document.querySelector('.loading-wrapper');
  var elDialog = document.querySelector('.dialog-wrapper');

  $(elToast).remove();
  $(elLoading).remove();
  $(elDialog).remove();
}