if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

PlugAuth.UI.bind_enter = function(input, callback) { 
  input.keypress(function(event){
    if(event.which == 10 || event.which == 13)
    {
      callback();
      return false;
    }
    else
    {
      return true;
    }
  });
}

$(document).ready(function(){

  PlugAuth.UI.error_modal = new PlugAuth.UI.Modal('Error');
  PlugAuth.UI.notice_modal = new PlugAuth.UI.Modal('Notice');
  PlugAuth.UI.data = JSON.parse($('#plugauth_webui_data').val());
  PlugAuth.UI.login.enable();

});
