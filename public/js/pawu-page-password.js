$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('password');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<h3>' + page.client.user + '<h3>'
    +                                   '<form id="plugauth_webui_change_password_form">'
    +                                   '<input type="password" placeholder="password" id="plugauth_webui_change_password_password" /><br/>'
    +                                   '<input type="password" placeholder="confirm"  id="plugauth_webui_change_password_confirm"/><br/>'
    +                                   '<button class="btn btn-primary" type="button" id="plugauth_webui_change_password_submit">Change Password</button>'
    +                                   '</form>');
  }
  page.order = 40;
  
  page.can = function()
  {
    return page.client.can('change_password', 'user/' + page.client.user)
  }

});
