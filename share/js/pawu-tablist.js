if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{
  var max_label_length = 25;

  var bootstrap_version = JSON.parse($('#plugauth_webui_data').val()).bootstrap_version;
  if(bootstrap_version === undefined)
    bootstrap_version = 2;

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
  
  PlugAuth.UI.TabList = function(list, opts)
  {
    var nav_html = '';
    var pane_html = '';
    
    if(opts === undefined)
      opts = {};
    if(opts.new_label === undefined)
      opts.new_label = 'new';

    list = list.sort();
    this.list = list;
    
    $.each(list, function(index, value) {
      nav_html += '<li id="plugauth_webui_tab_nav_' + index + '">'
      +           '<a id="plugauth_webui_tab_nav_a_' + index + '" href="#plugauth_webui_tab_content_' + index + '" data-toggle="tab">'
      +           label(value) + '</a></li>';
      pane_html += '<div class="tab-pane" id="plugauth_webui_tab_content_' + index + '"></div>';
    });

    if(bootstrap_version == 3)
    {
      $('#plugauth_webui_toolbar').html('<form class="navbar-form pull-left">'
      +                                   '<input type="text" placeholder="Search" id="plugauth_webui_tab_search">'
      +                                   '</form><form class="navbar-form pull-left">'
      +                                   '<button class="btn" id="plugauth_webui_tab_create">' + opts.new_label + '</button>'
      +                                   '<a href="#" class="btn small" id="plugauth_webui_csv_download">CSV</a>'
      +                                   '</form>');
    
      $('#plugauth_webui_container').html('<ul class="nav nav-pills nav-stacked col-md-2" id="plugauth_webui_tab_nav">'
      +                                   nav_html + '</ul>'
      +                                   '<div class="col-md-10" id="plugauth_webui_tab_content">'
      +                                   pane_html + '</div>');
    }
    else
    {
      $('#plugauth_webui_toolbar').html('<form class="navbar-form pull-left">'
      +                                   '<input type="text" placeholder="Search" id="plugauth_webui_tab_search">'
      +                                   '</form><form class="navbar-form pull-left">'
      +                                   '<button class="btn" id="plugauth_webui_tab_create">' + opts.new_label + '</button>'
      +                                   '<a href="#" class="btn small" id="plugauth_webui_csv_download">CSV</a>'
      +                                   '</form>');
    
      $('#plugauth_webui_container').html('<div class="tabbable tabs-left">'
      +                                   '<ul class="nav nav-tabs" id="plugauth_webui_tab_nav">'
      +                                   nav_html + '</ul>'
      +                                   '<div class="tab-content" id="plugauth_webui_tab_content">'
      +                                   pane_html + '</div></div>');
    }
    
    this.callback = function() {};
    this.create = function() {};
    var tl = this;
    
    $.each(list, function(index, value) {
      var content = $('#plugauth_webui_tab_content_'+index);
      $('#plugauth_webui_tab_nav_a_' + index).click(function() { 
        if(content.html() == '')
          tl.callback(value, content); 
        if(bootstrap_version == 3)
        {
          $.each(list, function(index, value) {
            $('#plugauth_webui_tab_content_' + index).hide();
          });
          content.show();
        }
        return true;
      });
    });
    
    $('#plugauth_webui_tab_form').submit(function() { return false });
    $('#plugauth_webui_tab_create').click(function() { tl.create(); return false });
    $('#plugauth_webui_csv_download').click(function() { return tl.download() });
    var input = $('#plugauth_webui_tab_search');
    var search = function() { tl.search(input.val()); return false };
    input.change(search);
    PlugAuth.UI.bind_enter(input, search);
  }
  
  PlugAuth.UI.TabList.prototype.search = function(text)
  {
    $.each(this.list, function(index, value) {
      if(value.indexOf(text) == -1)
      {
        $('#plugauth_webui_tab_nav_' + index).hide();
        $('#plugauth_webui_tab_nav_' + index).removeClass('active');
        var content = $('#plugauth_webui_tab_content_' + index);
        if(bootstrap_version == 3)
          content.hide();
        else
          content.removeClass('active');
      }
      else
      {
        $('#plugauth_webui_tab_nav_' + index).show();
      }
    });
  }
  
  PlugAuth.UI.TabList.prototype.get_display_list = function()
  {
    var list = [];
    $('ul#plugauth_webui_tab_nav li').each(function(index, li) {
      if(! $(li).is(":visible"))
        return;
      $(li).children('a').each(function(index, a) {
        list.push($(a).html());
      });
    });
    return list;
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
        if(content.html() == '')
          tl.callback(value, content);
      }
      else
      {
        nav.removeClass('active');
        content.removeClass('active');
      }
    });
  }

})();
