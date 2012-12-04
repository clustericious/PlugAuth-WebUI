(function()
{
  /* FIXME: don't think this is necessary since we are making
     $.ajax calls instead of .del
  */
  var ajax_request = function (url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
      callback = data;
      data = {};
    }
    return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };

  jQuery.extend({
    put: function(url, data, callback, type) {
        return ajax_request(url, data, callback, type, 'PUT');
    },
    del: function(url, data, callback, type) {
        return ajax_request(url, data, callback, type, 'DELETE');
    }
  });

})();
