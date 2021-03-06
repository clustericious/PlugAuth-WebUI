$(document).ready(function()
{
  var clear;
  var fetch_audit_good;
  var fetch_audit_bad;
  var date_to_string;
  var convert_date;
  var csv_data = [];

  /*
    $('#plugauth_webui_toolbar').html('<form class="navbar-form pull-left">'
    +                                   '<input type="text" placeholder="Search" id="plugauth_webui_tab_search">'
    +                                   '</form><form class="navbar-form pull-left">'
    +                                   '<button class="btn" id="plugauth_webui_tab_create">' + opts.new_label + '</button>'
    +                                   '</form>');
  */
  
  var page = new PlugAuth.UI.Page('audit', 'accounts', 'audit');
  page.select = function()
  {
    clear();
    var client = this.client;

    client.audit_check()
      .success(function(check) {

        $('#plugauth_webui_toolbar').html(
          '  <a ' +
          '     href="#" ' +
          '     class="btn smal" ' +
          '     id="plugauth_webui_audit_date_button" ' +
          '     data-date-format="yyyy-mm-dd" ' +
          '     data-date="2012-02-12">2012-02-12</a>' +
          '  <a href="#" class="btn small" id="plugauth_webui_audit_download">CSV</a>'
        );
        $('#plugauth_webui_container').html(
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
    
        $('#plugauth_webui_audit_download').click(function() {
          $('#plugauth_webui_audit_download').attr('href', PlugAuth.DL.data_to_uri({
              type: 'text/csv',
              content: PlugAuth.CSV.stringify(csv_data)
          }));
          return true;
        });
    
        $('#plugauth_webui_audit_date_button').attr('data-date', check.today);
        $('#plugauth_webui_audit_date_button').html(check.today);
        $('#plugauth_webui_audit_download').attr('download',
          'plugauth_audit_log_' + check.today + '.csv'
        );

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
    
          $('#plugauth_webui_audit_date_button').html(
            date_to_string(ev.date)
          );
          $('#plugauth_webui_audit_download').attr('download',
            'audit_log_' + date_to_string(ev.date) + '.csv'
          );
    
        }).data('datepicker');

        var today_list = check.today.split('-');
        client.audit(today_list[0], today_list[1], today_list[2])
          .error(fetch_audit_bad)
          .success(fetch_audit_good);
      })
      .error(fetch_audit_bad);
        
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
    csv_data = [['time','admin','event','user/group','arguments']];
  }
  
  fetch_audit_good = function(data)
  {
    data.forEach(function(element) {
      var args_html = [];
      var args_txt  = [];
      for(var key in element)
      {
        if(element.hasOwnProperty(key)
        && !key.match(/^time_/)
        && !key.match(/^(admin|event|user|group)$/))
        {
          args_html.push('<strong>' + key + '</strong>=' + element[key]);
          args_txt.push ([key, element[key]].join('='));
        }
      }
      
      args_html = args_html.join(', ');
      args_txt  = args_txt.join(', ');
      
      var user = element.user || element.group || '';
    
      $('#plugauth_webui_audit_table_body').append(
        '<tr>' +
        '  <td style="white-space:nowrap;">' + element.time_human + '</td>' +
        '  <td>' + element.admin      + '</td>' +
        '  <td>' + element.event      + '</td>' +
        '  <td>' + user               + '</th>' +
        '  <td>' + args_html          + '</td>' +
        '</tr>'
      );
      csv_data.push([element.time_human, element.admin, element.event, user, args_txt]);
    });
  }
  
  fetch_audit_bad  = function(data)
  {
    PlugAuth.UI.error_modal.html('<p>No entries for that day</p>');
    PlugAuth.UI.error_modal.show();
  }
  
});
