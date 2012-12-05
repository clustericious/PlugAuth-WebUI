$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('groups', 'accounts', 'group');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<p>wait</p>');
    this.client.group_list()
      .success(function(data) {
        
        var tl = new PlugAuth.UI.TabList(data);
        tl.callback = function(group, pane) {
          pane.html('<h3>' + group + '<h3>');
        };
        tl.create = function() {
          alert('create!');
        };
        
      });
  }
  page.order = 20;

});
