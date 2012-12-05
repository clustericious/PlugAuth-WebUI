if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

$(document).ready(function(){
  PlugAuth.UI.error_modal = new PlugAuth.UI.Modal('Error');
  PlugAuth.UI.notice_modal = new PlugAuth.UI.Modal('Notice');
  PlugAuth.UI.data = JSON.parse($('#plugauth_webui_data').val());
  PlugAuth.UI.login.enable();
});