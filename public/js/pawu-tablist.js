if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{

  var max_label_length = 25;

  var label = function(name)
  {
    var label = name;
    if(label.length > max_label_length)
    {
      label = label.substr(0,max_label_length-3);
      label += '...';
    }
    return label;
  }
  
  PlugAuth.UI.TabList = function(list)
  {
    var nav_html = '';
    var pane_html = '';

    list = list.sort();
    this.list = list;
    
    $.each(list, function(index, value) {
      nav_html += '<li id="plugauth_webui_tab_nav_' + index + '">'
      +           '<a id="plugauth_webui_tab_nav_a_' + index + '" href="#plugauth_webui_tab_content_' + index + '" data-toggle="tab">'
      +           label(value) + '</a></li>';
      pane_html += '<div class="tab-pane" id="plugauth_webui_tab_content_' + index + '"></div>';
    });
    
    $('#plugauth_webui_toolbar').html('<form class="navbar-form pull-left">'
    +                                   '<input type="text" class="span2" placeholder="Search" id="plugauth_webui_tab_search">'
    +                                   '</form><form class="navbar-form pull-left">'
    +                                   '<button class="btn" id="plugauth_webui_tab_create">new user</button>'
    +                                   '</form>');
    
    $('#plugauth_webui_container').html('<div class="tabbable tabs-left">'
    +                                   '<ul class="nav nav-tabs" id="plugauth_webui_tab_nav">'
    +                                   nav_html + '</ul>'
    +                                   '<div class="tab-content" id="plugauth_webui_tab_content">'
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
  
  PlugAuth.UI.TabList.prototype.append = function(value)
  {
    var index = this.list.length;
    $('#plugauth_webui_tab_nav').append('<li id="plugauth_webui_tab_nav_' + index + '">'
      +                                 '<a id="plugauth_webui_tab_nav_a_' + index + '" href="#plugauth_webui_tab_content_' + index + '" data-toggle="tab">'
      +                                 label(value) + '</a></li>');
    $('#plugauth_webui_tab_content').append('<div class="tab-pane" id="plugauth_webui_tab_content_' + index + '"></div>');
    this.list.push(value);
    var tl = this;
    var content = $('#plugauth_webui_tab_content_'+index);
    $('#plugauth_webui_tab_nav_a_' + index).click(function() { tl.callback(value, content); return true });
  }
  
  PlugAuth.UI.TabList.prototype.prepend = function(value)
  {
    var index = this.list.length;
    $('#plugauth_webui_tab_nav').prepend('<li id="plugauth_webui_tab_nav_' + index + '">'
      +                                 '<a id="plugauth_webui_tab_nav_a_' + index + '" href="#plugauth_webui_tab_content_' + index + '" data-toggle="tab">'
      +                                 label(value) + '</a></li>');
    $('#plugauth_webui_tab_content').prepend('<div class="tab-pane" id="plugauth_webui_tab_content_' + index + '"></div>');
    this.list.push(value);
    var tl = this;
    var content = $('#plugauth_webui_tab_content_'+index);
    $('#plugauth_webui_tab_nav_a_' + index).click(function() { tl.callback(value, content); return true });
  }
  
  PlugAuth.UI.TabList.prototype.remove = function(search_value)
  {
    $.each(this.list, function(index, value) {
      if(value == search_value)
      {
        $('#plugauth_webui_tab_nav_' + index).remove();
        $('#plugauth_webui_tab_content_' + index).remove();
      }
    });
  }
  
  PlugAuth.UI.TabList.prototype.select = function(search_value)
  {
    var tl = this;
    $.each(this.list, function(index, value) {
      var nav = $('#plugauth_webui_tab_nav_' + index);
      var content = $('#plugauth_webui_tab_content_' + index);
      if(value == search_value)
      {
        nav.addClass('active');
        content.addClass('active');
        tl.callback(value, content)
      }
      else
      {
        nav.removeClass('active');
        content.removeClass('active');
      }
    });
  }

})();
