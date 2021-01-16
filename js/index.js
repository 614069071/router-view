/* -------------- 登录 start-------------- */
var $login_wrapper = $('#login_wrapper');
var $content_wrapper = $('#content_wrapper');
var _LogintHtml = $login_wrapper.html();
var _ContentHtml = $content_wrapper.html();

$login_wrapper.empty();
$content_wrapper.empty();

// 加载登录内容
function loadLogin() {
  $content_wrapper.hide().empty();
  $login_wrapper.hide().html(_LogintHtml).show();
  _init();

  var $login_submit_btn = $('#login_submit');
  var $login_submit_input = $('#login_password');
  var $ps_error_tip = $('#ps_error_tip');
  // 判断状态加载数据

  function loginHandel() {
    var value = $login_submit_input.val();
    loadContent();
    $.cookie('__accessToken__', 1);

    return;
    if (value) {
      _loading();
      _login(value)
        .then(function (res) {
          console.log('login suc', res);
          if (res.error == 0) {
            loadContent();
            $.cookie('__accessToken__', 1);
          } else if (res.error == 10001) {
            _toast('密码错误');
          } else {
            _toast('登录失败');
          }
        })
        .catch(function (err) {
          _toast('密码错误', 'error');
        })
    } else {
      // $ps_error_tip.show().html('请输入密码');
      _toast('请输入密码');
    }
  }

  // 登录模块
  $login_submit_btn.on('click', function () {
    loginHandel();
  });

  $login_submit_input.on('keyup', function (event) {
    var e = event || window.event || {};
    if (e.keyCode == 13) {
      loginHandel();
    }
  });

  // 忘记密码弹窗显隐 - 按钮控制
  var $forgot_btn = $('#forgot_password_btn');
  var $forgot_tip = $('#forgot_tips');
  $forgot_btn.on('click', function () {
    $forgot_tip.toggle();
  });
}

// 加载主体内容
function loadContent() {
  $login_wrapper.hide().empty();
  $content_wrapper.hide().html(_ContentHtml).show();
  _init();
  /* -------------- 主体模块 start-------------- */
  var menuBarArray = [
    { title: '首页', module: 'route-status', icon: 'cloud', checked: true },
    { title: 'WAN口设置', module: 'route-internet', icon: 'WANkou' },
    { title: 'LAN口设置', module: 'route-lan', icon: 'LANkou' },
    { title: '修改密码', module: 'route-manage', icon: 'edit' },
    { title: '软件升级', module: 'route-update', icon: 'rocket' },
    { title: '关于我们', module: 'cloud-about', icon: 'question' },
  ];

  // 创建 NavMenu
  new _MenuTree(menuBarArray, $('.nav-menu-wrapper'));

  // 退出
  function exitHandel() {
    $.cookie('__accessToken__', 0);
    _storages.set('_module_', '')
    loadLogin();
  }

  $('#exit_btn').click(function () {
    exitHandel();
  });

  // 重置（恢复出厂设置） 待测试
  $('#reset_btn').click(function () {
    console.log('重置（恢复出厂设置）');
    _dialog({
      content: '是否重置？',
      icon: 'warning',
      success: function (callback) {
        callback();

        _loading('设备重置中，请等待...');
        _restoreRoute()
          .then(function (res) {
            console.log(res, 'default')
          })
          .catch(function (err) {
            _toast('设备重置失败，请检查设备连接是否正常！', 'error');
          })
        // 重启
        // _restartRoute()
        //   .then(function (res) {
        //     console.log(res, '重启suc');
        //     exitHandel();
        //   })
        //   .catch(function (err) {
        //     _toast('设备重启失败，请检查设备连接是否正常！', 'error');
        //   })
      }
    });
  })

  // 重启 待测试
  $('#restart_btn').click(function () {
    console.log('重启');

    _dialog({
      content: '是否重启？',
      icon: 'warning',
      success: function (callback) {
        _restartRoute()
          .then(function (res) {
            console.log(res, 'reboot')
          })
          .catch(function (err) {
            _toast('设备重启失败，请检查设备连接是否正常！', 'error');
          })
        callback();
      }
    });
  })

  /* 主体功能模块 */
  // 首页（设备状态）
  function setSvgStyle(num) {
    return 'stroke-dasharray: ' + (num || 0) + 'px, 295.31px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;';
  }

  var $network_state_svg = $('.network-state-svg');

  setTimeout(function () {
    $network_state_svg.prop('style', setSvgStyle(20));
  }, 3000)



  // WAN口设置
  var $internet_connect_select_options = $('.internet-connect-select .select-option');
  var $internet_connect_select_items = $('.connect-type-main-wrapper .model-type-item');

  $internet_connect_select_options.on('click', function () {
    var $index = $(this).index();
    $internet_connect_select_items.eq($index).show().siblings().hide();
  });

  // 提交
  var $setting_wizard_dynamic_form_submit = $('#setting_wizard_dynamic_form_submit');
  var $setting_wizard_broadband_form = $('#setting_wizard_broadband_form');
  var $setting_wizard_broadband_form_submit = $('#setting_wizard_broadband_form_submit');
  var $setting_wizard_broadband_form_tips = $setting_wizard_broadband_form.find('.label-item-tip');
  var $setting_wizard_static_form = $('#setting_wizard_static_form');
  var $setting_wizard_static_form_submit = $('#setting_wizard_static_form_submit');
  var $setting_wizard_static_form_tips = $setting_wizard_static_form.find('.label-item-tip');

  $setting_wizard_dynamic_form_submit.on('click', function () {
    console.log('DHCP（推荐）')
  });

  // 宽带拨号提交
  $setting_wizard_broadband_form_submit.on('click', function () {
    var data = _formArrToObject($setting_wizard_broadband_form);
    console.log('宽带拨号', data);
    if (!data.name1) {
      $setting_wizard_broadband_form_tips.eq(0).html('请输入宽带账号').slideDown();
      return;
    } else if (_space(data.name1)) {
      $setting_wizard_broadband_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_broadband_form_tips.eq(0).html('').slideUp();
    }

    if (!data.name2) {
      $setting_wizard_broadband_form_tips.eq(1).html('请输入宽带密码').slideDown();
      return;
    } else if (_space(data.name2)) {
      $setting_wizard_broadband_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_broadband_form_tips.eq(1).html('').slideUp();
    }

    // ajax

  });

  // 静态ip提交
  $setting_wizard_static_form_submit.on('click', function () {
    var data = _formArrToObject($setting_wizard_static_form);
    console.log('静态ip', data)
    if (!data.name1) {
      $setting_wizard_static_form_tips.eq(0).html('请输入宽带账号').slideDown();
      return;
    } else if (_space(data.name1)) {
      $setting_wizard_static_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_static_form_tips.eq(0).html('').slideUp();
    }

    if (!data.name2) {
      $setting_wizard_static_form_tips.eq(1).html('请输入宽带账号').slideDown();
      return;
    } else if (_space(data.name2)) {
      $setting_wizard_static_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_static_form_tips.eq(1).html('').slideUp();
    }
    // ajax

  });

  // lan设置
  // DCHP设备列表创建分页器
  new _Pager($('.device-list-pager-wrapper'), {
    total: 100,
    callback: function (index) {
      console.log('device', index);
    }
  });

  var $lan_set_select_options = $('.lan-connect-select .select-option');
  var $lan_set_select_items = $('.lan-set-wrapper .lan-type-item');

  $lan_set_select_options.on('click', function () {
    var $index = $(this).index();
    $lan_set_select_items.eq($index).show().siblings().hide();
  });

  // 自动设置（默认设置）
  var $setting_lan_auto_submit = $('#setting_lan_auto_submit');

  $setting_lan_auto_submit.on('click', function () {
    var parmas = { name1: '192.168.1.1', name2: '255.255.255.0' };

    console.log('自动', parmas)
  });
  // 手动设置
  var $setting_lan_custom_submit = $('#setting_lan_custom_submit');
  var $setting_lan_custom_frorm = $('#setting_lan_custom_frorm');
  var $setting_lan_custom_form_tips = $setting_lan_custom_frorm.find('.label-item-tip');

  $setting_lan_custom_submit.on('click', function () {
    var data = _formArrToObject($setting_lan_custom_frorm);

    console.log($setting_lan_custom_form_tips)

    if (!data.name1) {
      $setting_lan_custom_form_tips.eq(0).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data.name1)) {
      $setting_lan_custom_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data.name1)) {
      $setting_lan_custom_form_tips.eq(0).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $setting_lan_custom_form_tips.eq(0).html('').slideUp();
    }

    if (!data.name2) {
      $setting_lan_custom_form_tips.eq(1).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data.name2)) {
      $setting_lan_custom_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data.name2)) {
      $setting_lan_custom_form_tips.eq(1).html('请输入正确的子网掩码').slideDown();
      return;
    } else {
      $setting_lan_custom_form_tips.eq(1).html('').slideUp();
    }

  });

  // DHCP分配范围设置
  var $lan_dhcp_switch_btn = $('.lan-dhcp-switch');
  var $lan_dhcp_item_options = $('.lan-dhcp-item-option');
  var $setting_lan_dhcp_submit = $('#setting_lan_dhcp_submit');
  var $lan_dhcp_form = $('#lan_dhcp_form');
  var $lan_dhcp_form_tips = $lan_dhcp_form.find('.label-item-tip');

  $lan_dhcp_switch_btn.on('change', function () {
    var isChecked = $(this).prop('checked') ? 1 : 0;
    var index = isChecked ? 1 : 0;
    $lan_dhcp_item_options.hide().eq(index).show();
    console.log('DHCP服务器', isChecked)
  });

  $setting_lan_dhcp_submit.on('click', function () {
    var isChecked = $lan_dhcp_switch_btn.prop('checked');
    // 默认
    var data1 = { name1: '192.168.199.1', name2: '192.168.199.200' };
    // 范围
    var data2 = _formArrToObject($lan_dhcp_form);

    if (!data2.name1) {
      $lan_dhcp_form_tips.eq(0).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data2.name1)) {
      $lan_dhcp_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data2.name1)) {
      $lan_dhcp_form_tips.eq(0).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $lan_dhcp_form_tips.eq(0).html('').slideUp();
    }

    if (!data2.name2) {
      $lan_dhcp_form_tips.eq(1).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data2.name2)) {
      $lan_dhcp_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data2.name2)) {
      $lan_dhcp_form_tips.eq(1).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $lan_dhcp_form_tips.eq(1).html('').slideUp();
    }

    console.log(isChecked, data2);
  });

  // 设备管理 => 修改管理密码
  var $setting_manage_form = $('#setting_manage_form');
  var $setting_manage_form_submit = $('#setting_manage_form_submit');
  var $setting_manage_form_tips = $setting_manage_form.find('.label-item-tip');

  $setting_manage_form_submit.on('click', function () {
    var data = _formArrToObject($setting_manage_form);
    if (!data.name1) {
      $setting_manage_form_tips.eq(0).html('请输入旧密码').slideDown();
      return;
    } else if (_space(data.name1)) {
      $setting_manage_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    }
    //  else if (!_validePassword(data.name1)) {
    //   $setting_manage_form_tips.eq(0).html('请输入5-16位字母数字组合密码').slideDown();
    //   return;
    // } 
    else {
      $setting_manage_form_tips.eq(0).html('').slideUp();
    }

    if (!data.name2) {
      $setting_manage_form_tips.eq(1).html('请输入新密码').slideDown();
      return;
    } else if (_space(data.name2)) {
      $setting_manage_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else if (!_validePassword(data.name2)) {
      $setting_manage_form_tips.eq(1).html('请输入5-16位字母数字组合密码').slideDown();
      return;
    } else {
      $setting_manage_form_tips.eq(1).html('').slideUp();
    }

    if (!data.name3) {
      $setting_manage_form_tips.eq(2).html('请再次输入密码').slideDown();
      return;
    } else if (_space(data.name3)) {
      $setting_manage_form_tips.eq(2).html('输入不能包含空格').slideDown();
      return;
    } else if (data.name3 !== data.name2) {
      $setting_manage_form_tips.eq(2).html('两次输入的密码不一致').slideDown();
      return;
    } else {
      $setting_manage_form_tips.eq(2).html('').slideUp();
    }

    _loading();
    _login(data.name1)
      .then(function (res) {
        $setting_manage_form_tips.eq(0).html('').slideUp();

        if (res.error == 0) {
          // 修改密码
          _setAccount(data.name3)
            .then(function (res) {
              console.log('修改密码', res);

              if (res.error === 0) {
                _toast('修改成功，3秒后将自动回到登录页', 'success', function () {
                  $.cookie('__accessToken__', 0);
                  loadLogin();
                });
              } else {
                _toast('修改失败');
              }
            });
        } else if (res.error == 10001) {
          $setting_manage_form_tips.eq(0).html('旧密码验证错误').slideDown();
        } else {
          // _toast('系统异常', 'error');
        }
      })
      .catch(function () {

      })

  });

  // 设备管理 => 固件升级
  var $upgrade_popup_warpper = $('.upgrade-popup-warpper');
  var $progress_wrapper = $('.upgrade-progress-wrapper');
  var upgrade_Progress = new _Progress($progress_wrapper);
  // 线上更新
  var $detection_update_btn = $('#detection_update_btn');

  $detection_update_btn.on('click', function () {
    // 已经是最新版本
    // _dialog({
    //   content: '当前软件版本已是最新～',
    //   icon: 'warning',
    // }, true);

    //检测版本失败
    // _dialog({
    //   content: '检测版本失败，请检查网络后重试',
    //   icon: 'error',
    // }, true);

    // 检测到新版本
    _dialog({
      content: '检测到最新软件版本：2.2.4，是否升级？',
      icon: 'success',
      success: function (callback) {
        $upgrade_popup_warpper.show();
        upgrade_Progress.start();
        callback();
      }
    });
  });

  // 本地更新
  var $update_file = $('#update_file');
  var $upgrade_submit = $('#upgrade_submit');
  var $upgrade_name = $('.display-file-name');

  $update_file.on('change', function (e) {
    var file = e.target.files[0] || {};
    var name = file.name;
    name && $upgrade_name.addClass('active').text(name);
  })

  $upgrade_submit.on('click', function () {
    var $file = $update_file.prop('files')[0];
    if (!$file) {
      _toast('请选择升级文件！', 'warning');
      return;
    }
    $upgrade_popup_warpper.show();
    upgrade_Progress.start();
    return;
    uploadFile($file)
      .then(function (res) {
        console.log(res)
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  // 设备管理 => 重启
  var $restart_device_btn = $('#restart_device_btn');

  $restart_device_btn.on('click', function () {
    _dialog({
      success: function (callback) {
        // restartRoute();
        // callback();
      }
    });
  });

  // 设备管理 => 恢复出厂设置
  var $restore_device_btn = $('#restore_device_btn');

  $restore_device_btn.on('click', function () {
    _dialog({
      success: function (callback) {
        // restoreRoute();
        // callback();
      }
    });
  });
}

$(function () {
  var state = $.cookie('__accessToken__');
  console.log(state)

  if (state == '1') {
    loadContent();
  } else {
    loadLogin();
  }
});
