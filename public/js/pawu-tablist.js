if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{

  PlugAuth.UI.TabList = function(list)
  {
    var nav_html = '';
    var pane_html = '';

    list = list.sort();
    this.list = list;
    
    $.each(list, function(index, value) {
      nav_html += '<li id="plugauth_webui_tab_nav_' + index + '">'
      +           '<a id="plugauth_webui_tab_nav_a_' + index + '" href="#plugauth_webui_tab_content_' + index + '" data-toggle="tab">'
      +           value + '</a></li>';
      pane_html += '<div class="tab-pane" id="plugauth_webui_tab_content_' + index + '"></div>';
    });
    
    $('#plugauth_webui_container').html('<div class="navbar"><div class="navbar-inner"><form class="navbar-form pull-left">'
    +                                   '<input type="text" class="span2" placeholder="Search" id="plugauth_webui_tab_search">'
    +                                   '</form><form class="navbar-form pull-left">'
    +                                   '<button class="btn" id="plugauth_webui_tab_create">new user</button>'
    +                                   '</form></div></div>'
    +                                   '<div class="tabbable tabs-left">'
    +                                   '<ul class="nav nav-tabs">'
    +                                   nav_html + '</ul>'
    +                                   '<div class="tab-content">'
    +                                   pane_html + '</div></div>');
    
    this.callback = function() {};
    this.create = function() {};
    var tl = this;
    
    $.each(list, function(index, value) {
      var content = $('#plugauth_webui_tab_content_'+index);
      $('#plugauth_webui_tab_nav_a_' + index).click(function() { tl.callback(value, content); return true });
    });
    
    $('#plugauth_webui_tab_form').submit(function() { return false });
    $('#plugauth_webui_tab_search').change(function() { tl.search($('#plugauth_webui_tab_search').val()); return false });
    $('#plugauth_webui_tab_create').click(function() { tl.create(); return false });
    
    $('#plugauth_webui_user_nav_0').addClass('active');
    $('#plugauth_webui_user_content_0').addClass('active');
  }
  
  PlugAuth.UI.TabList.prototype.search = function(text)
  {
    $.each(this.list, function(index, value) {
      if(value.indexOf(text) == -1)
      {
        $('#plugauth_webui_tab_nav_' + index).hide();
        $('#plugauth_webui_tab_nav_' + index).removeClass('active');
        $('#plugauth_webui_tab_content_' + index).removeClass('active');
      }
      else
      {
        $('#plugauth_webui_tab_nav_' + index).show();
      }
    });
  }

})();
