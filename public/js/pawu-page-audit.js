$(document).ready(function()
{
  var clear;
  var fetch_audit_good;
  var fetch_audit_bad;
  var date_to_string;
  var convert_date;

  var page = new PlugAuth.UI.Page('audit', 'accounts', 'audit');
  page.select = function()
  {
    $('#plugauth_webui_container').html(
      '<div id="plugauth_webui_audit_control">' +
      '  <a ' +
      '     href="#" ' +
      '     class="btn smal" ' +
      '     id="plugauth_webui_audit_date_button" ' +
      '     data-date-format="yyyy-mm-dd" ' +
      '     data-date="2012-02-12">Today</a>' +
      '</div>' +
      '<table class="table table-striped">' +
      '  <thead>' +
      '    <tr>' +
      '      <th>time</th>' +
      '      <th>admin</th>' +
      '      <th>event</th>' +
      '      <th>user/group</th>' +
      '      <th>arguments</th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody id="plugauth_webui_audit_table_body">' +
      '  </tbody>' +
      '</table>'
    );

    /* FIXME: if the server and client have a different idea
       about what the current dte is this visuall be wrong,
       though you will see the current date's audit log regardless */    
    $('#plugauth_webui_audit_date_button').attr('data-date',
      date_to_string(new Date)
    );
    $('#plugauth_webui_audit_date_button').html(
      date_to_string(new Date)
    );
    
    clear();
    var client = this.client;
    client.audit_today()
      .error(fetch_audit_bad)
      .success(fetch_audit_good);
    
    var widget;
    widget = $('#plugauth_webui_audit_date_button').datepicker({
      onRender: function(date) {
        return '';
      }
    }).on('changeDate', function(ev) {
      widget.hide();
      var date = convert_date(ev.date);
      clear();
      client.audit(date.year, date.month, date.day)
        .error(fetch_audit_bad)
        .success(fetch_audit_good);
    }).data('datepicker');
        
  };
  
  convert_date = function(date)
  {
    var answer = {};
    answer.year  = date.getFullYear();
    answer.month = date.getMonth() + 1;
    answer.day   = date.getDate();
    if(answer.month < 10)
      answer.month = '0' + answer.month;
    if(answer.day < 10)
      answer.day = '0' + answer.day;
    return answer;
  }
  
  date_to_string = function(date)
  {
    date = convert_date(date);
    return date.year + '-' + date.month + '-' + date.day;
  }
  
  clear = function()
  {
    $('#plugauth_webui_audit_table_body').html('');
  }
  
  fetch_audit_good = function(data)
  {
    data.forEach(function(element) {
      args = '';
      for(var key in element)
      {
        if(element.hasOwnProperty(key)
        && !key.match(/^time_/)
        && !key.match(/^(admin|event|user|group)$/))
        {
          args += '<strong>' + key + '</strong>=' + element[key] + ', ';
        }
      }
      
      var user = element.user || element.group || '';
    
      $('#plugauth_webui_audit_table_body').append(
        '<tr>' +
        '  <td>' + element.time_human + '</td>' +
        '  <td>' + element.admin      + '</td>' +
        '  <td>' + element.event      + '</td>' +
        '  <td>' + user               + '</th>' +
        '  <td>' + args               + '</td>' +
        '</tr>'
      );
    });
  }
  
  fetch_audit_bad  = function(data)
  {
    PlugAuth.UI.error_modal.html('<p>No entries for that day</p>');
    PlugAuth.UI.error_modal.show();
  }
  
});
