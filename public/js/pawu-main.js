if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{

  $(document).ready(function(){
  
    PlugAuth.UI.data = JSON.parse($('#plugauth_webui_data').val());
    
    var client = new PlugAuth.Client(PlugAuth.UI.data.api_url);
    
    /* 
    client.version()
      .success(function(data, status) { alert("version: " + data + "\nstatus = " + status); });
    client.api()
      .success(function(data, status) { alert("api: " + data + "\nstatus = " + status); } );
    */
    
    /*
    client.users('public')
      .success(function(data, status) { alert('good: ' + data) })
      .error  (function(data, status) { alert('bad:  ' + data) });
    */
    
    /*
    client.auth()
      .success(function(data, status) { alert("none: good\n" + "data = " + data + "\nstatus = " + status ) })
      .error  (function(data, status) { alert("none: bad\n"  + "data = " + data + "\nstatus = " + status ) });
      
    client.login('foo', 'bar').auth()
      .success(function(data, status) { alert("foo: good\n" + "data = " + data + "\nstatus = " + status ) })
      .error  (function(data, status) { alert("foo: bad\n"  + "data = " + data + "\nstatus = " + status ) });
    */
    
    PlugAuth.UI.Page.Login.enable();
  });

})();
