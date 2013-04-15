$(document).ready(function ()
{
  var revoke_handler = function()
  {
    var row = this.parentNode.parentNode;
    var resource = row.cells[0].innerHTML;
    var action   = row.cells[1].innerHTML;
    var group    = row.cells[2].innerHTML;
    page.client.revoke(group, action, resource)
      .error(function() {
        PlugAuth.UI.error_modal.html('<p>Unable to revoke permission</p>');
        PlugAuth.UI.error_modal.show();
      })
      .success(function() {
        row.parentNode.parentNode.deleteRow(row.rowIndex);
      });
    return false;
  }

  var attach_revoke = function() { 
    $('#plugauth_webui_granted_table tbody tr td button').unbind('click', revoke_handler);
    $('#plugauth_webui_granted_table tbody tr td button').click(revoke_handler);
  };

  var grant_modal = 
    // setup grant
    (function() {
      var modal = new PlugAuth.UI.Modal('Grant');
      modal.html('<form>'
      +          '<input type="text" class="span3" placeholder="resource"   id="plugauth_webui_grant_resource" data-provide="typeahead" /><br />'
      +          '<input type="text" class="span3" placeholder="action"     id="plugauth_webui_grant_action"   data-provide="typeahead" /><br />'
      +          '<input type="text" class="span3" placeholder="user/group" id="plugauth_webui_grant_group"    data-provide="typeahead" /><br />'
      +          '<br /><br />'
      +          '</form>');
  
      var resource = $('#plugauth_webui_grant_resource');
      var action   = $('#plugauth_webui_grant_action');
      var group    = $('#plugauth_webui_grant_group');
      
      modal.on('show', function() {
        resource.val('');
        action.val('');
        page.client.actions()
          .success(function(data) {
            action.typeahead({ source: data.sort() });
          });
        group.val('');
        
        page.client.granted()
          .success(function(data) {
            resource.typeahead({ source: $.map(data, function(line) { return line.replace(/\s*\(.*$/, '') }).sort() });
          });
        
        var group_list = [];
        var count = 0;
        page.client.user_list()
          .success(function(data) {
            group_list = group_list.concat(data);
            if(++count == 2)
              group.typeahead({ source: group_list.sort() });
          });
        page.client.group_list()
          .success(function(data) {
            group_list = group_list.concat(data);
            if(++count == 2)
              group.typeahead({ source: group_list.sort() });
          });
      });

      modal.on('shown', function() {
        resource.focus();
      });
      
      var counter
      var grant = function()
      {
        modal.hide();
        page.client.grant(group.val(), action.val(), resource.val())
          .success(function() {
            $('#plugauth_webui_granted_table tbody').prepend('<tr><td>' + resource.val().replace(/^\/?/,'/')
            +                                                '</td><td>' + action.val() 
            +                                                '</td><td>' + group.val() 
            +                                                '</td><td><button class="btn btn-danger">Revoke</button></td></tr>');
            attach_revoke();
          })
          .error(function() {
            PlugAuth.UI.error_modal.html('<p>Unable to grant permission</p>');
            PlugAuth.UI.error_modal.show();
          });
        return false;
      }
      
      PlugAuth.UI.bind_enter(resource, function() { action.focus() });
      PlugAuth.UI.bind_enter(action,   function() { group.focus()  });
      PlugAuth.UI.bind_enter(group,    function() { grant()        });
      
      modal.add_button('Grant', 'btn-primary').click(function() { grant() });
      
      return modal;
    })();

  var page = new PlugAuth.UI.Page('resources', 'accounts', 'grant');
  page.select = function()
  {
    $('#plugauth_webui_toolbar').html('<form class="navbar-form pull-left">'
    +                                 '<input type="text" placeholder="Search" id="plugauth_webui_resource_search">'
    +                                 '</form><form class="navbar-form pull-left">'
    +                                 '<button class="btn" id="plugauth_webui_resource_grant_button">Grant</button>'
    +                                 '<a href="#" class="btn small" id="plugauth_webui_resource_download" download="plugauth_resources.csv">CSV</a>'
    +                                 '</form>');
    
    $('#plugauth_webui_resource_download').click(function()
    {
      var csv_data = [];
      $('#plugauth_webui_granted_table tr').each(function(index, tr) {
        if($(tr).css('display') != 'none')
          csv_data.push([$(tr).children().eq(0).html(), $(tr).children().eq(1).html(), $(tr).children().eq(2).html()]);
      });
      
      $('#plugauth_webui_resource_download').attr('href', PlugAuth.DL.data_to_uri({
          type: 'text/csv',
          content: PlugAuth.CSV.stringify(csv_data)
      }));
      
      return true;
    });
    
    // setup search
    (function() {
      var input = $('#plugauth_webui_resource_search');
      var search = function() {
        var search_text = input.val();
        $('#plugauth_webui_granted_table tbody tr').each(function(index,row) {
          if(search_text == ''
          || row.cells[0].innerHTML.indexOf(search_text) != -1
          || row.cells[1].innerHTML.indexOf(search_text) != -1
          || row.cells[2].innerHTML.indexOf(search_text) != -1)
          {
            row.style.display = 'table-row';
          }
          else
          {
            row.style.display = 'none';
          }
        });
      };
      input.change(search);
      PlugAuth.UI.bind_enter(input, search);
    })();
    
    $('#plugauth_webui_resource_grant_button').click(function() {
      grant_modal.show();
      return false;
    });
  
    $('#plugauth_webui_container').html('<table id="plugauth_webui_granted_table" class="table table-striped"><thead></thead><tbody></tbody></table>');
    $('#plugauth_webui_granted_table thead').html('<tr><th>resource</th><th>action</th><th>user/group</th><th>control</th></tr>');
    page.client.granted()
      .error(function(){
        PlugAuth.UI.error_modal.html('<p>Unable to retrieve grant list</p>');
        PlugAuth.UI.error_modal.show();
      })
      .success(function(data){
        $.each(data, function(index, value) {
          var match = value.match(/^(.*) \((.*)\): (.*)$/);
          if(match)
          {
            var group_list = match[3].split(',');
            var disabled = '';
            $.each(group_list, function(index, group) {
              group = group.replace(/^\s+/,'').replace(/\s+$/,'');
              if((group == page.client.user && (match[2] == 'change_password' || match[2] == 'accounts'))
              || (group == '#u' && match[1].match(/#u/)))
                disabled = ' disabled="disabled"';
              $('#plugauth_webui_granted_table tbody').append('<tr>' 
              +                                               '<td>' + match[1] + '</td>'
              +                                               '<td>' + match[2] + '</td>'
              +                                               '<td>' + group + '</td>'
              +                                               '<td><button class="btn btn-danger"' + disabled +'>Revoke</button></td>'
              +                                               '</tr>');
            });
          }
        });
        attach_revoke();
      });
  }
  page.order = 30;

});
