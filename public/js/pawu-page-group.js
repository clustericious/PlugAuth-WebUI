/*
 * FIXME: create_group
 * FIXME: label for in/out lists
 */

$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('groups', 'accounts', 'group');
  
  var get_user_lists = function(group, cb)
  {
    var count = 0;
    var user_in;
    var user_out;
    var fixup = function () {
      user_out = $.grep(user_out, function(value) { 
        return user_in.indexOf(value) == -1;
      });
    };
    var error = function () { 
      $('#plugauth_webui_container').html('');
      PlugAuth.UI.error_modal.html('<p>Unable to retrieve user lists</p>');
      PlugAuth.UI.error_modal.show();
      PlugAuth.UI.Menu.deselect();
    };
    page.client.user_list()
      .success(function(data) {
        count++;
        user_out = data.sort();
        if(count == 2)
        {
          fixup();
          cb(user_in,user_out);
        }
      })
      .error(error);
    page.client.users(group)
      .success(function(data) {
        count++;
        user_in = data.sort();
        if(count == 2)
        {
          fixup();
          cb(user_in,user_out);
        }
      })
      .error(error);
  }
  
  var counter = 0;
  
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
        
        var tl = new PlugAuth.UI.TabList(data, { new_label: 'New Group' });
        tl.callback = function(group, pane) {
          get_user_lists(group, function(user_in, user_out) {
            var id = 'plugauth_webui_group_membership_' +  counter++;
            pane.html('<h3>' + group + '<h3>'
            +         '<form>'
            +         '<select multiple="multiple" size="15" class="span2" id="' + id + '_in_list">'
            +         $.map(user_in, function(value) { return '<option>' + value + '</option>' }).join('')
            +         '</select>'
            +         '<select multiple="multiple" size="15" class="span2" id="' + id + '_out_list">'
            +         $.map(user_out, function(value) { return '<option>' + value + '</option>' }).join('')
            +         '</select>'
            +         '<br/>'
            +         '<button class="btn btn-danger span2" style="margin-left:0" id="' + id + '_remove_button">Remove Selected</button>'
            +         '<button class="btn btn-success span2" style="margin-left:0" id="' + id + '_add_button">Add Selected</button>'
            +         '<br/>'
            +         '<button class="btn span2" style="margin-left:0" id="' + id + '_select_all_remove_button">Select All</button>'
            +         '<button class="btn span2" style="margin-left:0" id="' + id + '_select_all_add_button">Select All</button>'
            +         '</form>');
            var _in = {
              list: $('#' + id + '_in_list'),
              exe:  $('#' + id + '_remove_button'),
              all:  $('#' + id + '_select_all_remove_button'),
            };
            var _out = {
              list: $('#' + id + '_out_list'),
              exe:  $('#' + id + '_add_button'),
              all:  $('#' + id + '_select_all_add_button'),
            };
            _in.all.click( function() { $('#' + id + '_in_list option') .attr("selected","selected"); return false });
            _out.all.click(function() { $('#' + id + '_out_list option').attr("selected","selected"); return false });
            
            var remove_single_user = function()
            {
              // FIXME
              var user = this.text;
              var option = this;
              page.client.group_delete_user(group, user)
                .error(function() {
                  PlugAuth.UI.error_modal.html('<p>Unable to remove user from group</p>');
                  PlugAuth.UI.error_modal.show();
                })
                .success(function() {
                  option.parentNode.remove(option.index);
                  var option_id = id + '_option_' + counter++;
                  _out.list.prepend('<option id="' + option_id + '">' + user + '</option>');
                  $('#' + option_id).dblclick(add_single_user);
                });
              return false;
            }
            
            var add_single_user = function()
            {
              // FIXME
              var user = this.text;
              var option = this;
              page.client.group_add_user(group, user)
                .error(function() {
                  PlugAuth.UI.error_modal.html('<p>Unable to add user to group</p>');
                  PlugAuth.UI.error_modal.show();
                })
                .success(function() {
                  option.parentNode.remove(option.index);
                  var option_id = id + '_option_' + counter++;
                  _in.list.prepend('<option id="' + option_id + '">' + user + '</option>');
                  $('#' + option_id).dblclick(remove_single_user);
                });
              return false;
            }
            
            $('#' + id + '_in_list option').dblclick(remove_single_user);
            $('#' + id + '_out_list option').dblclick(add_single_user);
            
            var refresh = function() 
            {
              get_user_lists(group, function(new_user_in, new_user_out) {
                user_in = new_user_in;
                user_out = new_user_out;
                _in .list.html($.map(user_in,  function(value) { return '<option>' + value + '</option>' }).join(''));
                _out.list.html($.map(user_out, function(value) { return '<option>' + value + '</option>' }).join(''));
                $('#' + id + '_in_list option').dblclick(remove_single_user);
                $('#' + id + '_out_list option').dblclick(add_single_user);
              });
            };
            
            var update_group = function(new_list) {
              page.client.update_group(group, new_list)
                .error(function() {
                  PlugAuth.UI.error_modal.html('<p>Unable to update group</p>');
                  PlugAuth.UI.error_modal.show();
                })
                .success(refresh);
            };
            
            _in.exe.click(function() {
              var cull_list = $('#' + id + '_in_list option:selected').map(function() { return this.text }).get();
              if(cull_list.length == 0)
              {
                PlugAuth.UI.error_modal.html('<p>No users selected</p>');
                PlugAuth.UI.error_modal.show();
              }
              var new_list = $.grep(user_in, function(value) { return cull_list.indexOf(value) == -1 });
              update_group(new_list);
              return false;
            });
            _out.exe.click(function() {
              var add_list = $('#' + id + '_out_list option:selected').map(function() { return this.text }).get();
              if(add_list.length == 0)
              {
                PlugAuth.UI.error_modal.html('<p>No users selected</p>');
                PlugAuth.UI.error_modal.show();
              }
              var new_list = user_in.concat(add_list);
              update_group(new_list);
              return false;
            });
          });
        };
        tl.create = function() {
          alert('create!');
        };
        
      });
  }
  page.order = 20;
});
