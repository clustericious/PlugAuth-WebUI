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

PlugAuth.UI.setup = function(client)
{
  $('#plugauth_webui_container').html('<div id="plugauth_webui_welcome"><p>Welcome to PlugAuth</p></div>');
  
  $('#plugauth_webui_welcome').append('<p>Client is <strong>' + PlugAuth.UI.NAME + '</strong> version <strong>' + PlugAuth.UI.VERSION + '</strong></p>');
  
  var pages = PlugAuth.UI.pages.sort(function(a,b) { return a.order - b.order });
  
  $.each(pages, function(index, page) {
    page.enable(client);
  });
  
  client.status()
    .success(function(data) {
      if(data.server_version === null)
        data.server_version = 'dev'; 
      $('#plugauth_webui_welcome').append('<p>Server is <strong>' + data.app_name + '</strong> '
      +                                   'version <strong>' + data.server_version + '</strong> '
      +                                   'on <strong>' + data.server_hostname + '</strong></p>');
    });
  
  client.audit_check()
    .success(function(data) {
      $('#plugauth_webui_welcome').append('<p>Audit Plugin version <strong>' + data.version + '</string></p>');
    });
}

$(document).ready(function() {

  PlugAuth.UI.error_modal = new PlugAuth.UI.Modal('Error');
  PlugAuth.UI.notice_modal = new PlugAuth.UI.Modal('Notice');
  PlugAuth.UI.data = JSON.parse($('#plugauth_webui_data').val());

});

PlugAuth.UI.main = function() {

  if(PlugAuth.UI.data.skip_login == 1)
  {
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url, PlugAuth.UI.data.user);
    PlugAuth.UI.setup(client);
  }
  else if(PlugAuth.UI.data.requires_authentic_credentials == 1)
  {
    PlugAuth.UI.login.enable();
  }
  else
  {
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
    client.can = PlugAuth.Client.create_fake_method('ok', 200);
    PlugAuth.UI.setup(client);
  }

};
