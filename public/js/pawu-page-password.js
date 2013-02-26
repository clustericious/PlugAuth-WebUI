$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('password');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<h3>change password<h3>'
    +                                   '<form id="plugauth_webui_change_password_form">'
    +                                   '<input class="span3" type="password" placeholder="password" id="plugauth_webui_change_password_password" /><br/>'
    +                                   '<input class="span3" type="password" placeholder="confirm"  id="plugauth_webui_change_password_confirm"/><br/>'
    +                                   '<button class="span3 btn btn-primary" type="button" id="plugauth_webui_change_password_submit" style="margin-left:0">Change Password</button>'
    +                                   '</form>');
    
    
    var password = $('#plugauth_webui_change_password_password');
    var confirm  = $('#plugauth_webui_change_password_confirm');
    var submit   = $('#plugauth_webui_change_password_submit');
    
    var change_password = function()
    {
      if(password.val() == '')
      {
        PlugAuth.UI.error_modal.html('<p>Passwords is empty</p>');
        PlugAuth.UI.error_modal.show();
      }
      else if(password.val() != confirm.val())
      {
        PlugAuth.UI.error_modal.html('<p>Passwords do not match</p>');
        PlugAuth.UI.error_modal.show();
      }
      else
      {
        var new_password = password.val();
        var client = page.client;
        client.change_password(client.user, new_password)
          .success(function() {
            PlugAuth.UI.notice_modal.html('<p>Password changed</p>');
            PlugAuth.UI.notice_modal.show();
            client.login(client.user, new_password);
          })
          .error  (function() {
            PlugAuth.UI.error_modal.html('<p>Error changing password</p>');
            PlugAuth.UI.error_modal.show();
          });
      }
      password.val('');
      confirm.val('');
    };
    
    submit.click(change_password);
    
    PlugAuth.UI.bind_enter(password, function() { confirm.focus() });
    PlugAuth.UI.bind_enter(confirm,  change_password);

  }
  page.order = 40;
  
  page.can = function()
  {
    if((typeof page.client.user === "undefined") || (typeof page.client.pass === "undefined"))
      return { success: function() { }, failure: function(f) { f() } };
    return page.client.can('change_password', 'user/' + page.client.user)
  }

});
