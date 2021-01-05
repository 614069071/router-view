// 禁止右键
// (function () {
//   document.ondragstart = function () { return false };
//   document.onbeforecopy = function () { return false };
//   document.onselectstart = function () { return false };
//   document.oncontextmenu = function () { return false };
//   document.oncopy = function () { document.selection && document.selection.empty(); };
//   document.onselect = function () { document.selection && document.selection.empty(); };
//   document.onmouseup = function () { document.selection && document.selection.empty(); }
// })();

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

// 请求地址
window._action = "http://" + document.domain + "/cgi-bin/cdata.cgi";

/* 
  @text 弹窗文字
  @awit 延迟时间
  return el
*/
window._toast = function (text, awit) {
  var elToast = document.querySelector('.toast-wrapper');

  if (elToast) $(elToast).remove();

  var $el = $('<div class="toast-wrapper">' + (text || 'toast') + '</div>');

  $('body').append($el);

  return $el.fadeIn(200).delay(awit || 2000).fadeOut(function () {
    $el.remove();
  });
}

// loading
window._loading = function (text) {
  var elLoading = document.querySelector('.loading-wrapper');

  if (elLoading) $(elLoading).remove();
  var content = text ? '<span class="loading-text"></span>' + text + '</span>' : '';
  var $el = $('<div class="loading-wrapper"><span class="icon-loading"></span>' + content + '</div>');

  $('body').append($el);
}

// 关闭所有弹窗
window._close = function () {
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
window._request = function (data, method) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: method || 'post',
      url: _action,
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
window._storages = {
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
window._formArrToObject = function (el) {
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


