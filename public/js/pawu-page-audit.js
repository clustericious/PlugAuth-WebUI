$(document).ready(function()
{
  var clear;
  var fetch_audit_good;
  var fetch_audit_bad;

  var page = new PlugAuth.UI.Page('audit', 'accounts', 'audit');
  page.select = function()
  {
    $('#plugauth_webui_container').html(
      '<div id="plugauth_webui_audit_status"></div>' +
      '<div id="plugauth_webui_audit_control">control</div>' +
      '<table class="table table-striped">' +
      '  <thead>' +
      '    <tr>' +
      '      <th>time</th>' +
      '      <th>admin</th>' +
      '      <th>event</th>' +
      '      <th>arguments</th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody id="plugauth_webui_audit_table_body">' +
      '  </tbody>' +
      '</table>'
    );
  
    clear();
    var client = this.client;
    client.audit_today()
      .error(fetch_audit_bad)
      .success(fetch_audit_good);
        
  };
  
  clear = function()
  {
    $('#plugauth_webui_audit_status').html('please wait');
    $('#plugauth_webui_audit_table_body').html('');
  }
  
  fetch_audit_good = function(data)
  {
    $('#plugauth_webui_audit_status').html('ready');
    data.forEach(function(element) {
      args = '';
      for(var key in element)
      {
        if(element.hasOwnProperty(key)
        && !key.match(/^time_/)
        && !key.match(/^(admin|event)$/))
        {
          args += '<strong>' + key + '</strong>=' + element[key] + ', ';
        }
      }
    
      $('#plugauth_webui_audit_table_body').append(
        '<tr>' +
        '  <td>' + element.time_human + '</td>' +
        '  <td>' + element.admin      + '</td>' +
        '  <td>' + element.event      + '</td>' +
        '  <td>' + args               + '</td>' +
        '</tr>'
      );
    });
  }
  
  fetch_audit_bad  = function(data)
  {
    $('#plugauth_webui_audit_status').html('no audit records for this day');
  }
  
});
