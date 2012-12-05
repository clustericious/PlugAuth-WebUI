if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};
if(PlugAuth.UI.Menu === undefined) PlugAuth.UI.Menu = {};

(function ()
{

  var counter = 0;

  PlugAuth.UI.Menu.MenuItem = function(aName)
  {
    this.name = aName;
    this.index = counter++;
    $('#plugauth_webui_main_menu').append(
      '<li class="plugauth_webui_menu_item" id="plugauth_webui_menu_' + this.index + '_li">'
    + '<a href="#" id="plugauth_webui_menu_' + this.index + '_a">' + this.name +'</a></li>');
    
    this.li = $('#plugauth_webui_menu_' + this.index + '_li');
    this.a  = $('#plugauth_webui_menu_' + this.index + '_a');
    
    var mi = this;
    this.li.hide();
    this.a.click(function() { 
      $('.plugauth_webui_menu_item').removeClass('active');
      mi.li.addClass('active'); 
      mi.cb(); 
      return false;
    });
    this.cb = function () {};
  }
  
  PlugAuth.UI.Menu.MenuItem.prototype.hide = function () { this.li.hide() }
  PlugAuth.UI.Menu.MenuItem.prototype.show = function () { this.li.show() }
  PlugAuth.UI.Menu.MenuItem.prototype.click = function (cb) { this.cb = cb }
  
  PlugAuth.UI.Menu.clear = function()
  {
    $('#plugauth_webui_main_menu').html('');
  }

})();
