// 登录
function _login(parmas, callback) {
  _request(parmas)
    .then(function (res) {
      if (res.error == 0) {
        $.cookie('LoginStatus', true);
        window.location.href = "/main.html";
      } else if (res.error == 10001) {
        _toast('密码错误');
      } else {
        _toast('登录失败');
      }
      callback && callback();
    })
    .catch(function (err) {
      console.log(err.status);
    });
}

// 设置向导
function _setStaticConfigWizard(parmas) {

}

// 获取日志
function _getSystemLog(el, callback) {
  var parmas = { operation: 'sys_log', function: 'get' };
  var url = "http://" + document.domain + "/cgi-bin/log.sh";

  _request(parmas, 'post', url)
    .thne(function (res) {
      var arr = res.data;
      var list = '';
      $.each(arr, function (i, e) {
        list += '<tr><td>' + e.index + '</td><td>' + e.type + '</td><td>' + e.info + '</td></tr>';
      })
      el.empty().html(list);
      callback && callback();
    })
    .catch(function (err) {
      console.log(err);
    })
}

// 修改管理密码
function updateManagePassword(oldPaswword, newPassword, confirmPassword, callback) {
  var oldPaswword = _trim(oldPaswword);
  var newPassword = _trim(newPassword);
  var confirmPassword = _trim(confirmPassword);

  if (!oldPaswword) {
    _toast('请输入旧密码');
    return;
  }

  if (!newPassword) {
    _toast('请输入新密码');
    return;
  }

  var reg = /[\':;*?~`!@#$%^&+={}\[\]\<\\(\),\.\。\，]/;
  if (newPassword.indexOf("%u") != -1 || reg.test(newPassword)) {
    _toast('密码不能包含中文字符或者特殊字符！');
    return;
  }

  if (newPassword.length < 5 || newPassword.length > 15) {
    _toast('请输入5-15位新密码');
    return;
  }

  if (!confirmPassword) {
    _toast('请再次输入确认密码');
    return;
  }

  if (newPassword != confirmPassword) {
    _toast('两次密码不一致');
    return;
  }

  var name = 'root';
  var str_md5 = $.md5(name + oldPaswword);
  var parmas = { operation: 'login', function: 'set', usrid: str_md5 };

  // 验证旧密码
  _request(parmas)
    .then(function (res) {
      if (res.error) {
        _toast('旧密码验证错误');
        return;
      }

      setAccount(newPassword, callback);
    })
    .catch(function (err) {
      console.log(err, 'updateManagePassword')
    })
}

// 修改管理密码
function setAccount(password, callback) {
  var modfiy_parmas = { operation: 'login_modfiy', user: 'admin', password: password };
  _request(modfiy_parmas)
    .then(function (res) {
      // 修改成功
      callback && callback(res);
    })
    .catch(function (err) {
      console.log(err, 'setAccount')
    })
}

// 固件升级
function uploadFile(file) {
  if (!file) {
    _toast('请选择升级文件！');
    return;
  }

  var formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'upload');
  formData.append('function', 'upgrade');

  _request(formData)
    .then(function (res) {
      console.log(res)
      getUpdateFileStatus();
    })
    .catch(function (err) {
      console.log(err)
    })
}

// 获取升级返回状态
function getUpdateFileStatus() {
  var parmas = { type: 'mtd_write', function: 'upgrade' };

  _request(parmas)
    .then(function (res) {
      console.log(res);
      if (res.error == 0) {
        if (res.status == 1) {
          clearInterval(interval);
          isGet = true;
          timeout = 0;

          if (res.check == 1) {
            // 升级中...
            //正在升级，大约需要2分钟。升级过程中请勿操作或断电...
            // var content = Upgrading_tips1;
            // GetProgressBar(content);//进度条
          } else {
            _toast('升级失败');
          }

        }
      } else {
        console.log(res.error)
      }
    })
    .catch(function (err) {
      console.log(err)
    })
}

// 重启路由器
function restartRoute() {
  var params = { operation: 'device_opt', action: 'reboot' };
  _request(params)
    .then(function (res) {
      console.log(res)
    })
    .catch(function (err) {
      console.log(err)
    })
}

// 恢复出厂设置
function restoreRoute() {
  var params = { operation: 'device_opt', action: 'default' };
  _request(params)
    .then(function (res) {
      console.log(res)
    })
    .catch(function (err) {
      console.log(err)
    })
}

