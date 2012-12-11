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
  $('#plugauth_webui_container').html('<p>Welcome to PlugAuth WebUI</p>');
    
  var pages = PlugAuth.UI.pages.sort(function(a,b) { return a.order - b.order });

  $.each(pages, function(index, page) {
    page.enable(client);
  });
}


$(document).ready(function(){

  PlugAuth.UI.error_modal = new PlugAuth.UI.Modal('Error');
  PlugAuth.UI.notice_modal = new PlugAuth.UI.Modal('Notice');
  PlugAuth.UI.data = JSON.parse($('#plugauth_webui_data').val());

  if(PlugAuth.UI.data.requires_authentic_credentials == 1)
  {
    PlugAuth.UI.login.enable();
  }
  else
  {
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
    client.can = client.version;
    PlugAuth.UI.setup(client);
  }
  /*
  
  var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
  client.granted()
    .success(function() {
      // fake out the can method, use version
      // which should never be HTTP 403
      client.can = client.version;
      PlugAuth.UI.setup(client);
    })
    .error(function() {
      PlugAuth.UI.login.enable();
    });  
    
    */

});
