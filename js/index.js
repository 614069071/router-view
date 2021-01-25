/* -------------- 登录 start-------------- */
var $login_wrapper = $('#login_wrapper');
var $content_wrapper = $('#content_wrapper');
var _LogintHtml = $login_wrapper.html();
var _ContentHtml = $content_wrapper.html();
var networkTimer = null;

$login_wrapper.empty();
$content_wrapper.empty();

// 加载登录内容
function loadLogin() {
  $content_wrapper.hide().empty();
  $login_wrapper.hide().html(_LogintHtml).show();
  clearInterval(networkTimer);
  _init();

  var $login_submit_btn = $('#login_submit');
  var $login_submit_input = $('#login_password');
  var $ps_error_tip = $('#ps_error_tip');
  var $forgot_btn = $('#forgot-password-btn');
  var $forgot_tip = $('#forgot_tips');
  // 判断状态加载数据

  function loginHandel() {
    var value = $login_submit_input.val();

    if (!value) {
      $ps_error_tip.html('请输入密码').slideDown();
      return;
    } else if (_space(value)) {
      $ps_error_tip.html('输入不能包含空格').slideDown();
      return;
    } else {
      $ps_error_tip.html('').slideUp();
    }

    // _storages.set('__accessToken__', 1);
    // loadContent();
    // return;

    _loading();
    _login(value)
      .then(function (res) {
        console.log('login suc', res);
        if (res.error == 0) {
          loadContent();
          _storages.set('__accessToken__', 1);
        } else if (res.error == 10001) {
          _toast('密码错误', 'error');
        } else {
          _toast('登录失败', 'error');
        }
      })
      .catch(function (err) {
        _toast('密码错误', 'error');
      })
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
  // 首页相关 => 设备信息
  var menuBarArray = [{
    title: '首页',
    module: 'route-status',
    icon: 'cloud',
    checked: true,
    callback: function () {
      getNetworkState();
      loadNetworkState();
    }
  },
  { title: 'WAN口设置', module: 'route-internet', icon: 'WANkou' },
  {
    title: 'LAN口设置',
    module: 'route-lan',
    icon: 'LANkou',
    callback: function () {
      onlineDHCPlist();
      initLanSetting();
    }
  },
  { title: '修改密码', module: 'route-manage', icon: 'edit' },
  { title: '软件升级', module: 'route-update', icon: 'rocket' },
  { title: '关于我们', module: 'cloud-about', icon: 'question' },
  ];

  // 创建 NavMenu
  new _MenuTree(menuBarArray, $('.nav-menu-wrapper'), function () {
    console.log('complate');
    var $label_item_tips = $('.label-item-tip');
    $label_item_tips.slideUp();
    clearInterval(networkTimer);
  });

  // 退出
  function exitHandel() {
    _storages.set('__accessToken__', 0);
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
  // 网络状态
  function getDegrees(size) {
    var sum = -120;
    var se = _toBety(size) + '/S';
    var deg = size / 1000;

    if (deg <= 600) {
      var c = (deg / 600) * 120;
      sum += c;
    } else if (deg <= 1024) {
      var c = (((deg - 600) / 424) * 60) + 120;
      sum += c;
    } else if (deg > 1024) {
      var c = (((deg - 1024) / 9216) * 60) + 180;

      sum += c;
      sum = sum > 120 ? 120 : sum;
    }

    return { deg: sum, bety: se };
  }

  function setDeviceInfo(el, data) {
    el.eq(0).text(data.model);
    el.eq(1).text(data.sn);
    el.eq(2).text(data.mac.toUpperCase());
    el.eq(3).text(data.version);
  }

  // 设置svg度数
  function setSvgStyle(num) {
    return 'stroke-dasharray: ' + (num || 0) + 'px, 295.31px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;';
  }

  // 设备信息
  var $device_items = $('.device-item');

  // 网络
  var $newrork_state = $('.newrork-state');
  var $netword_up_pointer = $('#netword_up_pointer');
  var $netword_up_speed = $('#netword_up_speed');
  var $netword_dw_pointer = $('#netword_dw_pointer');
  var $netword_dw_speed = $('#netword_dw_speed');

  // lan数量
  var $client_connect_state = $('.client-connect-state');
  var $client_svg_path = $('.client-svg-path');

  // 内置
  var $dev_total_cap = $('.dev_total_cap');
  var $dev_use_cap = $('.dev_use_cap');
  var $dev_remain_cap = $('.dev_remain_cap');
  var $dev_svg_path = $('.dev-svg-path');

  // usb
  var $usb_total_cap = $('.usb_total_cap');
  var $usb_use_cap = $('.usb_use_cap');
  var $usb_remain_cap = $('.usb_remain_cap');

  var CacheUpBety = 0;
  var CacheDownBety = 0;

  function getNetworkState() {
    console.log('loadNetworkState');

    // 设备信息
    _getDeviceInfo()
      .then(function (res) {
        setDeviceInfo($device_items, res);
        // 内置硬盘
        var dev_total = Number(res.dev.total) ? _toBety(res.dev.total * 1000) : 0;
        var dev_used = Number(res.dev.used) ? _toBety(res.dev.used * 1000) : 0;
        var dev_remain = Number(res.dev.total - res.dev.used) ? _toBety((res.dev.total - res.dev.used) * 1000) : 0;
        var devDeg = ((res.dev.used / res.dev.total) || 0) * 295.31;

        $dev_total_cap.text(dev_total);
        $dev_use_cap.text(dev_used);
        $dev_remain_cap.text(dev_remain);
        $dev_svg_path.prop('style', setSvgStyle(devDeg));

        // usb外接
        var usb_total = Number(res.usb.total) ? _toBety(res.usb.total * 1000) : 0;
        var usb_used = Number(res.usb.used) ? _toBety(res.usb.used * 1000) : 0;
        var usb_remain = Number(res.usb.total - res.usb.used) && _toBety((res.usb.total - res.usb.used) * 1000);

        $usb_total_cap.text(usb_total);
        $usb_use_cap.text(usb_used);
        $usb_remain_cap.text(usb_remain);
        console.log('获取设备信息 success', res);
      })
      .catch(function (err) {
        console.log('获取设备信息 error', err);
      })

    // 路由信息
    _getRouterInfo()
      .then(function (res) {
        // 网络状态
        if (res.connect == '1') {
          $newrork_state.removeClass('offline').text('在线');
        } else {
          $newrork_state.addClass('offline').text('离线');
        }
        // 上行速率
        if (CacheUpBety) {
          var new_up_byte = (res.up_byte - CacheUpBety) / 4;
          var nt1 = getDegrees(new_up_byte);
          $netword_up_pointer.css('transform', 'rotate(' + nt1.deg + 'deg)');
          $netword_up_speed.text(nt1.bety);
        }
        CacheUpBety = res.up_byte;
        // 下行速率
        if (CacheDownBety) {
          var new_down_byte = (res.down_byte - CacheDownBety) / 4;
          var nt2 = getDegrees(new_down_byte);
          $netword_dw_pointer.css('transform', 'rotate(' + nt2.deg + 'deg)');
          $netword_dw_speed.text(nt2.bety);
        }
        CacheDownBety = res.down_byte;
        // 运行时间 
        var time = formattingTime(res.uptime);
        var sTime = time.day ? '<i>' + time.day + '</i>天<i>' + time.hour + '</i>小时' : '<i>' + time.hour + '</i>小时';
        $device_items.eq(4).html(sTime);

        // lan口连接数量
        var clientDeg = (res.client / 255) * 295.31;
        $client_connect_state.text(res.client || 0);
        $client_svg_path.prop('style', setSvgStyle(clientDeg));

        console.log('获取路由信息 success', res);
      })
      .catch(function (err) {
        console.log('获取路由信息 error', err);
      })

    var _deviceInfo_ = _storages.get('_deviceInfo_');

    if (_deviceInfo_) {
      setDeviceInfo($device_items, _deviceInfo_);
      return;
    }
  }

  function loadNetworkState() {
    networkTimer && clearInterval(networkTimer);
    networkTimer = setInterval(function () {
      getNetworkState();
    }, 4000);
  }

  // var _module_ = _storages.get('_module_');
  // var __accessToken__ = _storages.get('__accessToken__');

  // if (__accessToken__ == '1' && (_module_ === 'route-status' || !_module_)) {
  //   getNetworkState();
  // }

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
    _setConnectDhcp()
      .then(function (res) {
        console.log('wan口设置 dhcp（推荐） success', res);
        _storages.set('__accessToken__', 0);
        _toast('设置成功');
      })
      .catch(function (err) {
        _storages.set('__accessToken__', 0);
        console.log('wan口设置 dhcp（推荐） error', err);
      })
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
    _setConnectPPPoE(data.name1, data.name2)
      .then(function (res) {
        console.log('wan口设置 PPoE success', res);
        _toast('设置成功');
      })
      .catch(function (err) {
        console.log('wan口设置 PPoE error', err)
      })
  });

  // 静态ip提交
  $setting_wizard_static_form_submit.on('click', function () {
    var data = _formArrToObject($setting_wizard_static_form);
    console.log('静态ip', data)
    if (!data.name1) {
      $setting_wizard_static_form_tips.eq(0).html('请输入IP').slideDown();
      return;
    } else if (_space(data.name1)) {
      $setting_wizard_static_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_static_form_tips.eq(0).html('').slideUp();
    }

    if (!data.name2) {
      $setting_wizard_static_form_tips.eq(1).html('请输入子网掩码').slideDown();
      return;
    } else if (_space(data.name2)) {
      $setting_wizard_static_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else {
      $setting_wizard_static_form_tips.eq(1).html('').slideUp();
    }
    // ajax
    var parmas = {
      operation: 'wan_setup',
      function: 'set',
      mode: 3,
      ip: data.name1,
      mask: data.name2,
      gw: data.name3,
      dns: data.name4,
      // mtu: '',
      // mac: '',
    };
    _setConnectStatic(parmas)
      .then(function (res) {
        console.log('wan口设置 静态 success', res);
        _storages.set('__accessToken__', 0);
      })
      .catch(function (err) {
        console.log('wan口设置 静态 error', err);
        _toast('更新成功');
        _storages.set('__accessToken__', 0);
      })
  });

  // lan设置
  // DCHP设备列表创建分页器
  // new _Pager($('.device-list-pager-wrapper'), {
  //   total: 100,
  //   callback: function (index) {
  //     console.log('device', index);
  //   }
  // });

  var $lan_set_select_options = $('.lan-connect-select .select-option');
  var $setting_lan_custom_frorm = $('#setting_lan_custom_frorm');
  var $setting_lan_custom_frorm_input = $setting_lan_custom_frorm.find('input');
  var $setting_lan_custom_form_tips = $setting_lan_custom_frorm.find('.label-item-tip');
  var $lan_mac = $('.lan-mac');
  var $lan_switch = $('.lan-switch');
  var $lan_switch_check = $lan_switch.children('input');
  // DHCP分配范围设置
  var $lan_dhcp_switch_btn = $('.lan-dhcp-switch');
  var $setting_lan_dhcp_submit = $('#setting_lan_dhcp_submit');
  var $lan_dhcp_form = $('#lan_dhcp_form');
  var $lan_dhcp_form_inputs = $lan_dhcp_form.find('input');
  var $lan_dhcp_form_tips = $lan_dhcp_form.find('.label-item-tip');
  var $lan_dhcp_start = $('.lan-dhcp-start');
  var $lan_dhcp_end = $('.lan-dhcp-end');
  var $lan_ip_input = $('#lan_ip_input');

  $lan_set_select_options.on('click', function () {
    var $index = $(this).index();
    if ($index) {
      $setting_lan_custom_frorm_input.prop('readonly', false);
    } else {
      $setting_lan_custom_frorm_input.eq(0).val('192.168.1.1');
      $setting_lan_custom_frorm_input.eq(1).val('255.255.255.0');
      $lan_dhcp_form_inputs.eq(0).val('192.168.1.1');
      $lan_dhcp_form_inputs.eq(1).val('192.168.1.254');
      $setting_lan_custom_frorm_input.prop('readonly', true);
    }
  });


  // 获取lan口信息
  function initLanSetting() {
    // 获取lan口信息
    _getLanInfo()
      .then(function (res) {
        $lan_mac.text(res.mac.toUpperCase());
        // 开启手动分配IP
        if (res.enable === '1') {
          $lan_switch.addClass('on');
          $lan_switch_check.prop('checked', true);
          $lan_dhcp_start.prop('readonly', false);
          $lan_dhcp_end.prop('readonly', false);
        } else if (res.enable == '0') {
          $lan_switch.removeClass('on');
          $lan_switch_check.prop('checked', false);
          $lan_dhcp_start.prop('readonly', true);
          $lan_dhcp_end.prop('readonly', true);
        }

        $lan_dhcp_start.val(res.start);
        $lan_dhcp_end.val(res.end);
        $setting_lan_custom_frorm_input.eq(0).val(res.ip);
        $setting_lan_custom_frorm_input.eq(1).val(res.mask);
      })
      .catch(function (err) {

      })
  }

  // 自动设置（默认设置）
  $lan_ip_input.on('blur', function () {
    var val = $(this).val();
    if (_ip(val)) {
      var se = val.split('.')[2];
      console.log(se);
      var val1 = $lan_dhcp_form_inputs.eq(0).val();
      var val2 = $lan_dhcp_form_inputs.eq(1).val();
      if (_ip(val1)) {
        var arr1 = val1.split('.');
        arr1[2] = se;
        arr1 = arr1.join('.');
        var arr2 = val2.split('.');
        arr2[2] = se;
        arr2 = arr2.join('.');
        $lan_dhcp_form_inputs.eq(0).val(arr1);
        $lan_dhcp_form_inputs.eq(1).val(arr2);
      }
    }
  });

  // $setting_lan_auto_submit.on('click', function () {
  //   var parmas = { name1: '192.168.1.1', name2: '255.255.255.0' };

  //   console.log('自动', parmas);

  //   _setLanInfo()
  //     .then(function (res) {
  //       console.log('lan口设置 success', res)
  //     })
  //     .catch(function (err) {
  //       console.log('lan口设置 error', err)
  //     })

  // });
  // 手动设置
  // $setting_lan_custom_submit.on('click', function () {
  //   var data = _formArrToObject($setting_lan_custom_frorm);

  //   console.log($setting_lan_custom_form_tips)

  //   _setLanInfo()
  //     .then(function (res) {
  //       console.log('lan口设置 success', res)
  //     })
  //     .catch(function (err) {
  //       console.log('lan口设置 error', err)
  //     })
  // });

  // DHCP分配范围设置
  $lan_dhcp_switch_btn.on('change', function () {
    var isChecked = $(this).prop('checked');

    if (isChecked) {
      $lan_dhcp_start.prop('readonly', false);
      $lan_dhcp_end.prop('readonly', false);
    } else {
      $lan_dhcp_start.prop('readonly', true);
      $lan_dhcp_end.prop('readonly', true);
    }

    console.log('DHCP服务器', isChecked)
  });

  $setting_lan_dhcp_submit.on('click', function () {
    var data1 = _formArrToObject($setting_lan_custom_frorm);
    var data2 = _formArrToObject($lan_dhcp_form);

    if (!data1.name1) {
      $setting_lan_custom_form_tips.eq(0).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data1.name1)) {
      $setting_lan_custom_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data1.name1)) {
      $setting_lan_custom_form_tips.eq(0).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $setting_lan_custom_form_tips.eq(0).html('').slideUp();
    }

    if (!data1.name2) {
      $setting_lan_custom_form_tips.eq(1).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data1.name2)) {
      $setting_lan_custom_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data1.name2)) {
      $setting_lan_custom_form_tips.eq(1).html('请输入正确的子网掩码').slideDown();
      return;
    } else {
      $setting_lan_custom_form_tips.eq(1).html('').slideUp();
    }

    if (!data2.name3) {
      $lan_dhcp_form_tips.eq(0).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data2.name3)) {
      $lan_dhcp_form_tips.eq(0).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data2.name3)) {
      $lan_dhcp_form_tips.eq(0).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $lan_dhcp_form_tips.eq(0).html('').slideUp();
    }

    if (!data2.name4) {
      $lan_dhcp_form_tips.eq(1).html('请输入IP地址').slideDown();
      return;
    } else if (_space(data2.name4)) {
      $lan_dhcp_form_tips.eq(1).html('输入不能包含空格').slideDown();
      return;
    } else if (!_ip(data2.name4)) {
      $lan_dhcp_form_tips.eq(1).html('请输入正确的IP地址').slideDown();
      return;
    } else {
      $lan_dhcp_form_tips.eq(1).html('').slideUp();
    }

    var enable = $lan_dhcp_switch_btn.prop('checked') ? '1' : '0';
    var start = data2.name3.split('.').pop();
    var end = data2.name4.split('.').pop();
    var ip_limit = end - start + 1;

    var parmas = {
      operation: 'dhcpd',
      function: 'set',
      ip: data1.name1,
      mask: data1.name2,
      start: data2.name3,
      end: data2.name4,
      enable: enable,
      // dns1: '',
      // dns2: '',
      ip_limit: ip_limit,
      ip_startthird: start
    };

    console.log('lan口设置 parmas', parmas);

    _setLanInfo(parmas)
      .then(function (res) {
        console.log('lan口设置 success', res);
        _toast('修改成功');
      })
      .catch(function (err) {
        _toast('修改成功');
        console.log('lan口设置 catch', err);
      })

  });

  // 获取DHCP列表
  var $dhcp_online_list_body = $('.dhcp-online-list-body');
  function onlineDHCPlist() {
    _getOlineList()
      .then(function (res) {
        var list = res.terminals || [];
        var table = '';

        $.each(list, function (i, item) {
          table += '<tr><td>' + (i + 1) + '</td><td>' + item.name + '</td><td>' + item.mac + '</td><td>' + item.ip + '</td></tr>';
        });

        $dhcp_online_list_body.empty().html(table);
        console.log('lan口设置 dhcp 设备列表 success', res)
      })
      .catch(function (err) {
        console.log('lan口设置 dhcp 设备列表 error', err)
      })
  }

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
                  _storages.set('__accessToken__', 0);
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

  // 提示框
  var $control_tip_btn = $('#control_tip_btn');
  var $change_ps_popur = $('#change_ps_popur');

  $control_tip_btn.on('click', function () {
    $change_ps_popur.toggle();
  });

  // 设备管理 => 固件升级
  var $upgrade_popup_warpper = $('.upgrade-popup-warpper');
  var $progress_wrapper = $('.upgrade-progress-wrapper');
  window.upgrade_Progress = new _Progress($progress_wrapper, 120);
  // 线上更新
  var $detection_update_btn = $('#detection_update_btn');

  $detection_update_btn.on('click', function () {
    _dialog({
      content: '当前软件版本已是最新～',
      icon: 'warning',
    }, true);

    return;

    _detectionVersion()
      .then(function (res) {
        if (res.state == 1) {
          // 已经是最新版本
          _dialog({
            content: '当前软件版本已是最新～',
            icon: 'warning',
          }, true);
        } else if (res.state == 2) {
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
        } else {
          // 检测版本失败
          _dialog({
            content: '检测版本失败，请检查网络后重试',
            icon: 'error',
          }, true);
        }
      })
      .catch(function (err) {

      })
  });

  // 本地更新
  var $update_file = $('#update_file');
  var $upgrade_submit = $('#upgrade_submit');
  var $upgrade_name = $('.display-file-name');
  var $upload_file_tip = $('.label-item-tip');

  $update_file.on('change', function (e) {
    var file = e.target.files[0] || {};
    console.log(file, 'file')
    var name = file.name;
    var arr = name.split('.');
    var fileType = arr[arr.length - 1];

    if (!name) {
      $upgrade_name.removeClass('active').text('请点击浏览');
      $upload_file_tip.text('').slideUp();
      return;
    }

    if (fileType !== 'bin') {
      $update_file.val('');
      $upgrade_name.removeClass('active').text('请点击浏览');
      $upload_file_tip.text('升级文件为非法数据，请通过官网下载合法升级文件').slideDown();
      return;
    }

    $upgrade_name.addClass('active').text(name);
    $upload_file_tip.text('').slideUp();
  })

  $upgrade_submit.on('click', function () {
    var $file = $update_file.prop('files')[0];
    if (!$file) {
      $upload_file_tip.text('升级文件不能为空，请通过浏览选择升级的文件').slideDown();
      return;
    } else {
      $upload_file_tip.text('').slideUp();
    }

    $upgrade_popup_warpper.show();
    upgrade_Progress.start();

    _uploadFile($file)
      .then(function (res) {
        console.log('上传文件 success', res);

        _upgradeStart()
          .then(function (res) {
            if (res.check == '1') {
              console.log('升级 success', res);
              _toast('升级完成，设备重启中...');
            } else {
              _toast('升级失败');
            }
            upgrade_Progress.finish();
            $upgrade_popup_warpper.hide();
          })
          .catch(function (err) {
            console.log('升级失败 error', res);
            _toast('升级失败');
            upgrade_Progress.close();
            $upgrade_popup_warpper.hide();
          })
      })
      .catch(function (err) {
        console.log('上传文件 error', err);
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
  var state = _storages.get('__accessToken__');
  console.log(state)

  if (state == '1') {
    loadContent();
  } else {
    loadLogin();
  }
});