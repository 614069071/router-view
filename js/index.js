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

  var $loginSubmitBtn = $('#login_submit');
  var $loginSubmitInput = $('#login_password');
  var $psErrorTip = $('#ps_error_tip');
  // 判断状态加载数据

  function loginHandel() {
    var value = $loginSubmitInput.val();

    if (value) {
      $.cookie('LoginStatus', true);


      // _login(value)
      //   .then(function (res) {
      //     console.log(res);
      loadContent();
      //   })
      //   .catch(function (err) {
      //     console.log(err)
      //   })
    } else {
      // $psErrorTip.show().html('请输入密码');
      _toast('请输入密码');
    }
  }

  // 登录模块
  $loginSubmitBtn.on('click', function () {
    loginHandel();
  });

  $loginSubmitInput.on('keyup', function (event) {
    var e = event || window.event || {};
    if (e.keyCode == 13) {
      loginHandel();
    }
  });

  // 忘记密码弹窗显隐 - 按钮控制
  var $forgotBtn = $('#forgot_password_btn');
  var $forgotTip = $('#forgot_tips');
  $forgotBtn.on('click', function () {
    $forgotTip.toggle();
  });
}

// 加载主体内容
function loadContent() {
  $login_wrapper.height(0).empty().hide();
  $content_wrapper.height('100%').html(_ContentHtml).show();
  _init();
  /* -------------- 主体模块 start-------------- */
  var menuBarArray = [
    { title: '设备状态', module: 'route-status', checked: true },
    { title: 'WAN口设置', module: 'route-internet' },
    { title: 'LAN口设置', module: 'route-lan' },
    { title: '路由器管理', module: 'route-manage' },
    // { title: 'DHCP服务器', module: 'device-manage' },
    // { title: '系统日志', module: 'route-log' },
    // { title: '磁盘操作', module: 'cloud-control' },
    { title: '关于我们', module: 'cloud-about' },
  ];

  // 创建 NavMenu
  new _MenuTree(menuBarArray, $('.nav-menu-wrapper'));

  // DCHP设备列表创建分页器
  // new _Pager($('.device-list-pager-wrapper'), {
  //   total: 100,
  //   callback: function (index) {
  //     console.log('device', index);
  //   }
  // });

  // 系统日志 分页器
  // new _Pager($('.roter-log-pager-wrapper'), {
  //   total: 100,
  //   callback: function (index) {
  //     console.log('log', index);
  //   }
  // });

  // 退出
  $('#exit_btn').click(function () {
    $.cookie('LoginStatus', false);
    loadLogin();
  });
  /* 主体功能模块 */
  // 路由设置 => 上网设置
  var $connectRadioBtns = $('.connect-type-wrapper .check-type');
  var $connectModels = $('.connect-type-main-wrapper .model-type-item');

  // tab切换
  $connectRadioBtns.on('change', function () {
    var $index = $(this).data('index');
    $connectModels.hide().eq($index).show();
  });

  // lan设置
  var $lanRadios = $('#setting_lan_form .check-type');
  var $lanTypeItems = $('#setting_lan_form .lan-type-item');

  $lanRadios.on('change', function () {
    var $index = $(this).data('index');
    $lanTypeItems.hide().eq($index).show();
  });

  // 设备管理 => 修改管理密码
  var $setting_manage_form = $('#setting_manage_form');
  var $setting_manage_form_submit = $('#setting_manage_form_submit');

  $setting_manage_form_submit.on('click', function () {
    var data = _formArrToObject($setting_manage_form);
    var f = validateManagePassword(data.oldPassword, data.newPassword, data.confirmPassword);
  });

  // 设备管理 => 固件升级
  var $update_file = $('#update_file');
  var $upgrade_submit = $('#upgrade_submit');
  var $progressBarwrapper = $('.progress-bar-wrapper');
  var $upgrade_name = $('.upgrade-name');

  $update_file.on('change', function (e) {
    var file = e.target.files[0] || {};
    var name = file.name;
    name && $upgrade_name.text(name);
  })

  var upgrade_Progress = new _Progress($progressBarwrapper, 120);

  $upgrade_submit.on('click', function () {
    var $file = $update_file.prop('files')[0];
    if (!$file) {
      _toast('请选择升级文件！');
      return;
    }
    upgrade_Progress.start();
    uploadFile($file)
      .then(function (res) {
        console.log(res)
      })
      .catch(function (err) {
        console.log(err)
      })
  })

  // 设备管理 => 重启
  var $restartDeviceBtn = $('#restart_device_btn');

  $restartDeviceBtn.on('click', function () {
    _dialog({
      success: function () {
        restartRoute();
        // _close();
      }
    });
  });

  // 设备管理 => 恢复出厂设置
  var $restoreDeviceBtn = $('#restore_device_btn');

  $restoreDeviceBtn.on('click', function () {
    _dialog({
      success: function () {
        // restoreRoute();
        // _close();
      }
    });
  });
}

$(function () {
  var state = $.cookie('LoginStatus');

  console.log(state);

  if (state == 'true') {
    loadContent();
  } else {
    loadLogin();
  }
});
