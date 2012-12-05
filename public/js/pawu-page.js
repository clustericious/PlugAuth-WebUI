if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{
  PlugAuth.UI.pages = [];

  PlugAuth.UI.Page = function(name, action, resource)
  {
    this.action = action;
    this.resource = resource;
    this.name = name;
    this.order = 999999;
    PlugAuth.UI.pages.push(this);
  }
  
  PlugAuth.UI.Page.prototype.enable = function(client)
  {
    this.client = client;
    var page = this;
    var menu = new PlugAuth.UI.Menu.MenuItem(this.name);
    this.can().success(function()
    {
      menu.show();
      menu.click(function() { 
        $('#plugauth_webui_toolbar').html('');
        page.select();
      });
    });
  }
  
  PlugAuth.UI.Page.prototype.can = function()
  {
    return this.client.can(this.action,this.resource);
  }

})();
