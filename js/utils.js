//去除空白符
function _trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 校验ip
function _ip(str) {
  var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
  return reg.test(str);
}

/* 
  @data 请求数据
  @method 请求方式
*/
function _request(data, method, url) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: method || 'post',
      url: url || _action,
      timeout: 3000,
      data: data,
      // dataType: "json",
      dataType: "jsonp",
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
      // complete: function (xhr) {
      //   xhr.abort();
      // }
    });
  })
}

// 会话存储
var _storages = {
  set: function (key, value) {
    if (typeof value === 'object' && value !== null) {
      sessionStorage.setItem(key, JSON.stringify(value));
      return;
    }
    sessionStorage.setItem(key, value);
  },
  get: function (key) {
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
  del: function (key) {
    sessionStorage.removeItem(key);
  }
}

// 将表单的数组对象格式转为对象格式
// [{name:''},{age:''}] => {name:'',age:''}
// el jquery表单节点
function _formArrToObject(el) {
  var arr = el.serializeArray();
  var form = {};
  $(arr).each(function (i, e) {
    form[e.name] = e.value;
  });

  // for (var i = 0; i < arr.length; i++) {
  //   form[arr[i].name] = arr[i].value;
  // }
  return form;
}

/* 
  @text 弹窗文字
  @awit 延迟时间
  return el
*/
function _toast(text, awit) {
  var elToast = document.querySelector('.toast-wrapper');

  if (elToast) $(elToast).remove();

  var $el = $('<div class="toast-wrapper">' + (text || 'toast') + '</div>');

  $('body').append($el);

  return $el.fadeIn(200).delay(awit || 2000).fadeOut(function () {
    $el.remove();
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

function _dialog(options) {
  var options = options || {};
  var el = document.querySelector('.dialog-wrapper');

  if (el) $(el).remove();

  var wrapper = $('<div class="dialog-wrapper"></div>');
  var inner = $('<div class="dialog-inner"></div>');
  var title = $('<div class="dialog-title">' + (options.title || '温馨提示') + '</div>');
  var main = $('<div class="dialog-main">' + (options.content || '') + '</div>');
  var btns = $('<div class="dialog-btns"></div>');
  var cancel = $('<button class="button info">' + (options.cancelText || "取消") + '</button>');
  var success = $('<button class="button">' + (options.successText || "确定") + '</button>');

  function close() {
    wrapper.remove();
  }

  cancel.on('click', function () {
    close();
    options.cancel && options.cancel();
  });

  success.on('click', function () {
    options.success && options.success(close);
  });

  btns.append(cancel);
  btns.append(success);
  inner.append(title);
  inner.append(main);
  inner.append(btns);
  wrapper.append(inner);

  $('body').append(wrapper);
}

// 关闭所有弹窗
function _close() {
  var elToast = document.querySelector('.toast-wrapper');
  var elLoading = document.querySelector('.loading-wrapper');
  $(elToast).remove();
  $(elLoading).remove();
}