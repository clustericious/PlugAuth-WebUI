if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{
  var page = PlugAuth.UI.login = {};

  page.enable = function()
  {
    $('#plugauth_webui_container').html('<form>'
    +                                   '<input id="plugauth_webui_login_user" name="user" type="text"     placeholder="username" />'
    +                                   '<br/>'
    +                                   '<input id="plugauth_webui_login_pass" name="pass" type="password" placeholder="password" />'
    +                                   '</form>');
    $('#plugauth_webui_toolbar').html('');
    PlugAuth.UI.Menu.clear();
    var user = $('#plugauth_webui_login_user');
    var pass = $('#plugauth_webui_login_pass');
    user.focus();
    
    $(document).ready(function() {
      PlugAuth.UI.bind_enter(user, function() { pass.focus() });
      PlugAuth.UI.bind_enter(pass, function() { page.attempt(user.val(), pass.val()) });
    });
  }
  
  page.attempt = function(user, pass)
  {
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
    client.login(user,pass);
    client.auth()
          .success(function() { page.success(client) })
          .error  (page.error);
  }
  
  page.success = function(client)
  {
    PlugAuth.UI.setup(client);
    var menu = new PlugAuth.UI.Menu.MenuItem('logout');
    menu.click(page.enable);
    menu.show();
  }

  $(document).ready(function() {
    var login_error_modal = new PlugAuth.UI.Modal('Authentication Error');
    login_error_modal.html('<p>Either the credentials you provided were wrong, or there was an error in transport with the PlugAuth server.</p>'
      +                    '<p>Response: <span class="badge badge-important" id="plugauth_webui_login_error_status"></span>'
      +                    '             <span id="plugauth_webui_login_error_data"></span></p>');
    page.error = function(data, status)
    {
      $('#plugauth_webui_login_error_status').html(status);
      $('#plugauth_webui_login_error_data').html(data);
      login_error_modal.show();
    };
  });

})();
