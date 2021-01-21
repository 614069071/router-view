//去除空白符
function _trim(str) {
  return str.replace(/\s/g, "");
}

// 空白
function _space(str) {
  return (/\s/g).test(str);
}

// 数字密码组合
function _validePassword(str) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/;

  return reg.test(str);
}

// 校验ip
function _ip(str) {
  var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
  return reg.test(str);
}

function _toBety(size) {
  var c = 0;
  var num = size / 1000;
  var bety = ['K', 'M', 'G', 'T'];

  while (num >= 1024) {
    num /= 1024;
    c++;
  }

  return num.toFixed(2) + bety[c];
}

// 统一格式
function formatNumber(n) {
  var n = n.toString();
  return n[1] ? n : '0' + n;
}

// 序列化时间
function _formatTime(date, type) {
  // var year = date.getFullYear();
  // var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  // var minute = date.getMinutes();
  // var second = date.getSeconds();

  return { day: day, hour: hour };
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
      dataType: "json",
      success: function (res) {
        // console.log(res);
        resolve(res);
      },
      error: function (err) {
        // console.log(err);
        reject(err);
      },
      complete: function (xhr) {
        xhr.abort();
        _close();
      }
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
    // form[e.name] = _trim(e.value);
    form[e.name] = e.value;
  });

  // for (var i = 0; i < arr.length; i++) {
  //   form[arr[i].name] = arr[i].value;
  // }
  return form;
}