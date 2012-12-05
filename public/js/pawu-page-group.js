$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('groups', 'accounts', 'group');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<p>wait</p>');
    this.client.group_list()
      .error(function() {
        $('#plugauth_webui_container').html('');
        PlugAuth.UI.error_modal.html('<p>Unable to retrieve group list</p>');
        PlugAuth.UI.error_modal.show();
        PlugAuth.UI.Menu.deselect();
      })
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
