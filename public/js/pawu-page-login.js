if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};
if(PlugAuth.UI.Page === undefined) PlugAuth.UI.Page = {};
if(PlugAuth.UI.Page.Login === undefined) PlugAuth.UI.Page.Login = {};

(function ()
{
  var page = PlugAuth.UI.Page.Login;

  page.enable = function()
  {
    $('#plugauth_webui_container').html('<form><table>' +
                                        '<tr><th>user</td><td><input id="plugauth_webui_login_user" name="user" /></td><tr>' +
                                        '<tr><th>pass</td><td><input id="plugauth_webui_login_pass" name="pass" /></td><tr>' +
                                        '</table></form>');
    $('#plugauth_webui_main_menu').html('');
    $('#plugauth_webui_login_user').focus();
    $('#plugauth_webui_login_user').keypress(page.user_key_press);
    $('#plugauth_webui_login_pass').keypress(page.pass_key_press);
  }
  
  page.user_key_press = function(aEvent)
  {
    if(aEvent.which == 10 || aEvent.which == 13)
    {
      $('#plugauth_webui_login_pass').focus();
      return false;
    }
    return true;
  }
  
  page.pass_key_press = function (aEvent)
  {
    if(aEvent.which == 10 || aEvent.which == 13)
    {
      page.attempt();
      return false;
    }
    return true;
  }
  
  page.attempt = function()
  {
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
    client.login($('#plugauth_webui_login_user').val(), $('#plugauth_webui_login_pass').val());
    client.auth()
          .success(function() { page.success(client) })
          .error  (page.error);
  }
  
  page.success = function(aClient)
  {
    $('#plugauth_webui_container').html('<p>you are logged in!</p>');
        
    PlugAuth.UI.Page.User.enable(aClient);
    
    $('#plugauth_webui_main_menu').append('<li><a href="#" id="plugauth_webui_menu_logout">logout</a></li>');
    $('#plugauth_webui_menu_logout').click(page.logout);
  }
  
  page.logout = function()
  {
    page.enable();
  }
  
  page.error = function()
  {
    alert('bad');
  }

})();
