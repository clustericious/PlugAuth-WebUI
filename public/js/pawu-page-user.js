$(document).ready(function ()
{
  var create_user_modal = new PlugAuth.UI.Modal('New User');
  create_user_modal.html('<form id="plugauth_webui_create_user_form">'
    +                    '<input id="plugauth_webui_create_user_name"    name="user"    type="text"     placeholder="username" /><br/>'
    +                    '<input id="plugauth_webui_create_user_pass"    name="pass"    type="password" placeholder="password" /><br/>'
    +                    '<input id="plugauth_webui_create_user_confirm" name="confirm" type="password" placeholder="confirm"  />'
    +                    '</form>'
    +                    '<p id="plugauth_webui_create_user_message"></p>');

  create_user_modal.form    = $('#plugauth_webui_create_user_form');
  create_user_modal.user    = $('#plugauth_webui_create_user_name');
  create_user_modal.pass    = $('#plugauth_webui_create_user_pass');
  create_user_modal.confirm = $('#plugauth_webui_create_user_confirm');
  create_user_modal.message = $('#plugauth_webui_create_user_message');
  
  remove_user_modal = new PlugAuth.UI.Modal('Remove User');
  remove_user_modal.html('<p>Please confirm removal of user <span id="plugauth_webui_remove_user_name"></span></p>');
  remove_user_modal.confirm = remove_user_modal.add_button('Remove', 'btn-danger');
  remove_user_modal.confirmed = function() { };
  remove_user_modal.confirm.click(function () { remove_user_modal.confirmed() });
  
  var counter = 0;
  
  var page = new PlugAuth.UI.Page('users', 'accounts', 'user');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<p>wait</p>');
    var client = this.client;
    client.user_list()
      .error(function() {
        $('#plugauth_webui_container').html('');
        PlugAuth.UI.error_modal.html('<p>Unable to retrieve user list</p>');
        PlugAuth.UI.error_modal.show();
        PlugAuth.UI.Menu.deselect();
      })
      .success(function(data) {
        
        var tl = new PlugAuth.UI.TabList(data, { new_label: 'New User' });
        
        tl.download = function() {
        
          $('#plugauth_webui_csv_download').attr('href', PlugAuth.DL.data_to_uri({
            type: 'text/csv',
            content: PlugAuth.CSV.stringify([['user']].concat(tl.get_display_list()))
          }));
          
          $('#plugauth_webui_csv_download').attr('download', 'plugauth_user.csv');
          
          return true;
        
        };
        
        tl.callback = function(user, pane) {
          var index = counter++;
          pane.html('<h3>' + user + '</h3>'
          +         '<form id="plugauth_webui_change_password_' + index + '_form">'
          +         '<input class="span3" type="password" placeholder="password" id="plugauth_webui_change_password_' + index + '_password" /><br/>'
          +         '<input class="span3" type="password" placeholder="confirm"  id="plugauth_webui_change_password_' + index + '_confirm"/><br/>'
          +         '<button class="span3 btn btn-primary" type="button" id="plugauth_webui_change_password_' + index + '_submit" style="margin-left:0">Change Password</button><br/>'
          +         '<br/>'
          +         '<button class="span3 btn btn-danger" id="plugauth_webui_remove_user_button_' + index + '" style="margin-left:0" >Remove User</button>'
          +         '</form>');
          
          var change_password_widgets = $.map([ 'password', 'confirm', 'submit' ], function(value, mapindex) {
            var widget = $('#plugauth_webui_change_password_' + index + '_' + value);
            widget.attr('disabled', 'disabled');
            return widget;
          });
          
          if(user == client.user)
          {
            $('#plugauth_webui_remove_user_button_' + index).attr('disabled', 'disabled');
          }
          else
          {
            $('#plugauth_webui_remove_user_button_' + index).click(function() {
              page.remove_user(user);
              return false;
            });
            client.can('change_password', 'user/' + user)
              .success(function() {
                $.each(change_password_widgets, function(index, widget) { widget.removeAttr('disabled') });
                // FIXME: enter in password should move to confirm and enter in confirm should change password
                //        not sure about the second part.
                $('#plugauth_webui_change_password_' + index + '_submit').click(function() {
                  var password = $('#plugauth_webui_change_password_' + index + '_password').val();
                  var confirm  = $('#plugauth_webui_change_password_' + index + '_confirm').val();
                  $('#plugauth_webui_change_password_' + index + '_password').val('');
                  $('#plugauth_webui_change_password_' + index + '_confirm').val('');
                  if(password != confirm)
                  {
                    PlugAuth.UI.error_modal.html('<p>Passwords do not match</p>');
                    PlugAuth.UI.error_modal.show();
                    return;
                  }
                  if(password == '')
                  {
                    PlugAuth.UI.error_modal.html('<p>Passwords is empty</p>');
                    PlugAuth.UI.error_modal.show();
                    return;
                  }
                  client.change_password(user, password)
                    .success(function() {
                      PlugAuth.UI.notice_modal.html('<p>Password changed</p>');
                      PlugAuth.UI.notice_modal.show();
                    })
                    .error  (function() {
                      PlugAuth.UI.error_modal.html('<p>Unable to change password</p>');
                      PlugAuth.UI.error_modal.show();
                    });
                });
              });
          }
        };
        tl.create = function() {
          create_user_modal.show();
        };
        
        page.create_user = function() {
          if(create_user_modal.pass.val() != create_user_modal.confirm.val())
          {
            create_user_modal.hide();
            PlugAuth.UI.error_modal.html('<p>Passwords do not match</p>');
            PlugAuth.UI.error_modal.show();
            return;
          }
          create_user_modal.form.hide();
          create_user_modal.message.html('Please wait');
          create_user_modal.message.show();
          page.client.create_user(create_user_modal.user.val(), create_user_modal.pass.val())
              .error  (function () { 
                create_user_modal.hide();
                PlugAuth.UI.error_modal.html('<p>Unable to create user</p>');
                PlugAuth.UI.error_modal.show();
              })
              .success(function () {
                create_user_modal.hide();
                tl.prepend(create_user_modal.user.val());
                tl.select(create_user_modal.user.val());
              });
        };
        
        page.remove_user = function(user) {
          remove_user_modal.confirmed = function()
          {
            page.client.delete_user(user)
              .success(function () { 
                remove_user_modal.hide();
                tl.remove(user);
              })
              .error(function() { 
                remove_user_modal.hide(); 
                PlugAuth.UI.error_modal.html('<p>Unable to remove user</p>');
                PlugAuth.UI.error_modal.show();
              });
          }
          remove_user_modal.show();
        };
        
      });
  }
  page.order = 10;

  create_user_modal.create_button = create_user_modal.add_button('Create', 'btn-primary');
  create_user_modal.create_button.click(function() {page.create_user() });
  
  create_user_modal.on('show', function() {
    create_user_modal.user.val('');
    create_user_modal.pass.val('');
    create_user_modal.confirm.val('');
    create_user_modal.form.show();
    create_user_modal.message.hide();
    create_user_modal.create_button.removeAttr('disabled');
  });
  
  create_user_modal.on('shown', function() {
    create_user_modal.user.focus();
  });

  PlugAuth.UI.bind_enter(create_user_modal.user, function() { create_user_modal.pass.focus() });
  PlugAuth.UI.bind_enter(create_user_modal.pass, function() { create_user_modal.confirm.focus() });
  PlugAuth.UI.bind_enter(create_user_modal.confirm, function() { page.create_user() });

});
