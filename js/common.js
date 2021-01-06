// 禁止右键
function disEvent() {
    document.ondragstart = function() { return false };
    document.onbeforecopy = function() { return false };
    document.onselectstart = function() { return false };
    document.oncontextmenu = function() { return false };
    document.oncopy = function() { document.selection && document.selection.empty(); };
    document.onselect = function() { document.selection && document.selection.empty(); };
    document.onmouseup = function() { document.selection && document.selection.empty(); }
}

// disEvent();

// switch组件交互
var $allSwitchBtns = $("input[role='switch']");
$allSwitchBtns.on('change', function() {
    var isChecked = $(this).prop('checked');
    var parent = $(this).parent();
    isChecked ? parent.addClass('on') : parent.removeClass('on');
});

var $allRadioBtns = $("input[type=radio]");
$allRadioBtns.on('change', function() {
    var name = $(this).prop('name');
    var list = $('input[name=' + name + ']');
    list.parent().removeClass('on');
    $(this).parent().toggleClass('on');
});

// 设置所有input元素的autocomplete属性
var $inputTypeTexts = $('input');
$inputTypeTexts.prop('autocomplete', 'off');

// 请求地址
window._action = "http://" + document.domain + "/cgi-bin/cdata.cgi";

/* 
  @text 弹窗文字
  @awit 延迟时间
  return el
*/
window._toast = function(text, awit) {
    var elToast = document.querySelector('.toast-wrapper');

    if (elToast) $(elToast).remove();

    var $el = $('<div class="toast-wrapper">' + (text || 'toast') + '</div>');

    $('body').append($el);

    return $el.fadeIn(200).delay(awit || 2000).fadeOut(function() {
        $el.remove();
    });
}

// loading
window._loading = function(text) {
    var elLoading = document.querySelector('.loading-wrapper');

    if (elLoading) $(elLoading).remove();
    var content = text ? '<span class="loading-text"></span>' + text + '</span>' : '';
    var $el = $('<div class="loading-wrapper"><span class="icon-loading"></span>' + content + '</div>');

    $('body').append($el);
}

// 关闭所有弹窗
window._close = function() {
    var elToast = document.querySelector('.toast-wrapper');
    var elLoading = document.querySelector('.loading-wrapper');
    $(elToast).remove();
    $(elLoading).remove();
}

/* 
  @data 请求数据
  @method 请求方式
  return null
*/
window._request = function(data, method) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: method || 'post',
            url: _action,
            timeout: 3000,
            data: data,
            // dataType: "json",
            dataType: "jsonp",
            success: function(res) {
                resolve(res);
            },
            error: function(err) {
                reject(err);
            },
            // complete: function (xhr) {
            //   xhr.abort();
            // }
        });
    })
}

// 会话存储
window._storages = {
    set: function(key, value) {
        if (typeof value === 'object' && value !== null) {
            sessionStorage.setItem(key, JSON.stringify(value));
            return;
        }
        sessionStorage.setItem(key, value);
    },
    get: function(key) {
        var value = sessionStorage.getItem(key) || '';
        var val = null;
        try {
            val = JSON.parse(value);
        } catch (e) {
            return value;
        }

        if (typeof val === 'number') {
            return value;
        }
        return val;
    },
    del: function(key) {
        sessionStorage.removeItem(key);
    }
}

// 将表单的数组对象格式转为对象格式
// [{name:''},{age:''}] => {name:'',age:''}
// el jquery表单节点
window._formArrToObject = function(el) {
    var arr = el.serializeArray();
    var form = {};
    $(arr).each(function(i, e) {
        form[e.name] = e.value;
    });

    // for (var i = 0; i < arr.length; i++) {
    //   form[arr[i].name] = arr[i].value;
    // }
    return form;
}

/* -------------------创建分页器 start -------------------*/
window._Pager = function(root, options) {
    this.root = root || $('body');
    this.cache = 0;
    this.addPage = 0;
    this.current = 1; //当前索引
    this.total = options.total; //总数凉条数
    this.size = options.size || 10; //分页条数
    this.step = options.step || 8; //显示条数
    this.callback = options.callback || function() {}

    this.init(root);
}

_Pager.prototype.switch = function(type) {
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

_Pager.prototype.select = function(item) {
    this.current = item;
    var index = item + this.addPage;
    this.callback(index);
};

_Pager.prototype.create = function() {
    var self = this;
    var items = new Array(this.cache);

    $.each(items, function(i) {
        var item = $('<span class="pager-item ' + (self.current === (i + 1) ? 'active' : '') + '">' + (i + 1 + self.addPage) + '</span>');
        item.on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            self.select(i + 1);
        });
        items[i] = item;
    })

    return items;
}

_Pager.prototype.update = function() {
    var $el = this.root.find('.pager-body');
    var items = this.create();

    $el.empty().append(items);
}

_Pager.prototype.init = function() {
        var self = this;
        // 创建分页数量
        var num = Math.ceil(this.total / this.size);

        this.cache = num >= this.step ? this.step : num;

        var $wrapper = $('<div class="pager-view-wrapper right"></div>');
        var $leftBtn = $('<div class="pager-btn"><i class="icon-arrow-left"></i></div>');
        $leftBtn.on('click', function() {
            self.switch('left');
            self.update();
        })

        var $rightBtn = $('<div class="pager-btn"><i class="icon-arrow-right"></i></div>');
        $rightBtn.on('click', function() {
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
window._MenuTree = function(arr, el) {
    this.appendMenuToEle(arr, el);
}

_MenuTree.prototype.initMenuHandel = function() {
    var $menu_submenu_titles = $('.menu-submenu-title');
    var $menu_item_titles = $('.menu-item-title');

    $menu_submenu_titles.on('click', function() {
        var other = $(this).parent().siblings();
        other.children('.menu-submenu-body').slideUp();
        other.children('.menu-submenu-title').removeClass('open');
        $(this).toggleClass('open').next().slideToggle();
    });

    $menu_item_titles.on('click', function() {
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

_MenuTree.prototype.createMenuItem = function(arr, pl) {
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

_MenuTree.prototype.createMenuTree = function(arr) {
    var result = this.createMenuItem(arr);
    var body = '<ul class="menu-bar-body">' + result + '</ul>';

    return body;
}

_MenuTree.prototype.appendMenuToEle = function(arr, el) {
        var root = el || $('body');
        var menuTree = this.createMenuTree(arr);
        root.append(menuTree);
        this.initMenuHandel();
    }
    /* ------------------- 创建 NavMenu end ------------------- */