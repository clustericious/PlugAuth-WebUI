if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};
if(PlugAuth.UI.Page === undefined) PlugAuth.UI.Page = {};
if(PlugAuth.UI.Page.User === undefined) PlugAuth.UI.Page.User = {};

(function ()
{
  var page = PlugAuth.UI.Page.User;

  var client;
  
  page.enable = function(aClient)
  {
    $('#plugauth_webui_main_menu').append('<li id="plugauth_webui_menu_user_li"><a href="#" id="plugauth_webui_menu_user_a">users</a></li>');
    $('#plugauth_webui_menu_user_li').hide();
  
    client = aClient;
    client.can('accounts', 'user').success(function()
    {
      $('#plugauth_webui_menu_user_a').click(page.select);
      $('#plugauth_webui_menu_user_li').show();
    });
  }
  
  page.select = function()
  {
    $('#plugauth_webui_container').html('<p>wait</p>');
    $('#plugauth_webui_menu_user_li').addClass('active');
    client.user_list()
      .success(function(data) {
        
        var tl = new PlugAuth.UI.TabList(data);
        tl.callback = function(user, pane) {
          pane.html('user = ' + user);
        };
        tl.create = function() {
          alert('create!');
        };
        
      });
    
  }

})();
