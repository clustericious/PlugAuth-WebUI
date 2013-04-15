if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.DL === undefined) PlugAuth.DL = {};

(function ()
{

  /* input fields:
     - type: mime type
     - charset: UTF-8 by default
     - content: the raw content
   */
  PlugAuth.DL.data_to_uri = function(data)
  {
    return 'data:' + data.type + ';charset=' + (data.charset || 'UTF-8') + ',' + encodeURIComponent(data.content);
  }

})();
