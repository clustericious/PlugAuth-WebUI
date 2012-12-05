$(document).ready(function ()
{
  var page = new PlugAuth.UI.Page('resources', 'accounts', 'grant');
  page.select = function()
  {
    $('#plugauth_webui_container').html('<p>resources</p>');
  }
  page.order = 30;

});
