var $internet_connect_select = $('.internet-connect-select');
var $internet_connect_selects = $internet_connect_select.find('.select-option');
var $internet_connect_items = $('.option-item-main');

$internet_connect_selects.click(function () {
  var $value = $(this).data('value');
  $internet_connect_items.hide().eq($value).show();
});
