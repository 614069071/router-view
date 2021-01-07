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
function updateManagePassword(oldPaswword, newPassword, confirmPassword) {
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

      setAccount(newPassword);
    })
    .catch(function (err) {
      console.log(err, 'updateManagePassword')
    })
}

// 修改管理密码
function setAccount(password, type) {
  var modfiy_parmas = { operation: 'login_modfiy', user: 'admin', password: password };
  _request(modfiy_parmas)
    .then(function (res) {
      // 修改成功
      if (!res.error) {
        if (type != 'guide') {
          // Mod_passwd_success
          _toast('修改成功,请用新密码重新登录');
        }
        if (!_guide) {
          if (type == "wanSet") {
            window.location.href = '/login.html';
          } else {
            // 跳到登录
            window.location.href = '/login.html';
            $.cookie('LoginStatus', false);
          }
        } else {
          $.cookie('LoginStatus', false);
          window.location.href = '/login.html';
        }
      } else {
        console.log(res.error);
      }
    })
    .catch(function (err) {
      console.log(err, 'setAccount')
    })
}

