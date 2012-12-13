var client;

var success_response_handler = function(is_success, data, status)
{
  ok(is_success, 'called success');
  ok(data == 'ok', 'data == ok');
  ok(status == 200, 'status == 200');
  start();
}

module( "auth", {
  setup: function() { client = new PlugAuth.Client(PlugAuth.UI.data.api_url) },
});

asyncTest( "primus:spark", function() {
  expect(3);
  
  client.login('primus', 'spark').auth()
    .success(function(data, status) { success_response_handler(true, data, status)  })
    .error  (function(data, status) { success_response_handler(false, data, status) });
});

asyncTest( "optimus:matrix", function() {
  expect(3);
  
  client.login('optimus', 'matrix').auth()
    .success(function(data, status) { success_response_handler(true, data, status)  })
    .error  (function(data, status) { success_response_handler(false, data, status) });
});

asyncTest( "bogus:bogus", function() {
  expect(3);
  
  var error_response_handler = function(is_error, data, status)
  {
    ok(is_error, 'called error');
    ok(data == 'not ok', 'data == not ok');
    ok(status == 403, 'status == 403');
    start();
  }
  
  client.login('bogus', 'bogus').auth()
    .success(function(data, status) { error_response_handler(false, data, status)  })
    .error  (function(data, status) { error_response_handler(true, data, status) });
});
