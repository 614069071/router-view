/* -------------- 登录 start-------------- */
var $login_wrapper = $('#login_wrapper');
var $content_wrapper = $('#content_wrapper');
var _LogintHtml = $login_wrapper.html();
var _ContentHtml = $content_wrapper.html();

$login_wrapper.empty();
$content_wrapper.empty();

// 加载登录内容
function loadLogin() {
  $content_wrapper.empty().height(0).hide();
  $login_wrapper.height('100%').html(_LogintHtml).show();
  _init();

  var $login_submit_btn = $('#login_submit');
  var $login_submit_input = $('#login_password');
  var $ps_error_tip = $('#ps_error_tip');
  // 判断状态加载数据

  function loginHandel() {
    var value = $login_submit_input.val();

    if (value) {
      $.cookie('__accessToken__', 1);


      // _login(value)
      //   .then(function (res) {
      //     console.log(res);
      loadContent();
      //   })
      //   .catch(function (err) {
      //     console.log(err)
      //   })
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
  $login_wrapper.height(0).empty().hide();
  $content_wrapper.height('100%').html(_ContentHtml).show();
  _init();
  /* -------------- 主体模块 start-------------- */
  var menuBarArray = [
    { title: '首页', module: 'route-status', checked: true },
    { title: 'WAN口设置', module: 'route-internet' },
    { title: 'LAN口设置', module: 'route-lan' },
    { title: '修改密码', module: 'route-manage' },
    { title: '软件升级', module: 'route-update' },
    { title: '关于我们', module: 'cloud-about' },
  ];

  // 创建 NavMenu
  new _MenuTree(menuBarArray, $('.nav-menu-wrapper'));

  // 退出
  $('#exit_btn').click(function () {
    $.cookie('__accessToken__', 1);
    loadLogin();
  });
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

  $setting_lan_custom_submit.on('click', function () {
    var parmas = _formArrToObject($setting_lan_custom_frorm);

    console.log('手动', parmas)

  });

  // DHCP分配范围设置
  var $lan_dhcp_switch_btn = $('.lan-dhcp-switch');
  var $lan_dhcp_item_options = $('.lan-dhcp-item-option');

  $lan_dhcp_switch_btn.on('change', function () {
    var isChecked = $(this).prop('checked') ? 1 : 0;
    var index = isChecked ? 1 : 0;
    $lan_dhcp_item_options.hide().eq(index).show();
    console.log('DHCP服务器', isChecked)
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
    } else if (!_validePassword(data.name1)) {
      $setting_manage_form_tips.eq(0).html('请输入5-16位字母数字组合密码').slideDown();
      return;
    } else {
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

    console.log(data, 123)

    return;
    var f = validateManagePassword(data.oldPassword, data.newPassword, data.confirmPassword);
  });

  // 设备管理 => 固件升级
  var $upgrade_popup_warpper = $('.upgrade-popup-warpper');
  var $progress_wrapper = $('.upgrade-progress-wrapper');
  var upgrade_Progress = new _Progress($progress_wrapper, 100);
  // 线上更新
  var $detection_update_btn = $('#detection_update_btn');

  $detection_update_btn.on('click', function () {
    _dialog({
      content: '检测到最新软件版本：2.2.4是否升级',
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
  var $upgrade_name = $('.upgrade-name');

  $update_file.on('change', function (e) {
    var file = e.target.files[0] || {};
    var name = file.name;
    name && $upgrade_name.text(name);
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
