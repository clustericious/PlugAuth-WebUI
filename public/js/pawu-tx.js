if(PlugAuth === undefined) var PlugAuth = {};

(function ()
{
  /* TODO make *_cb arrays so we can have multiple callbacks */
  PlugAuth.Tx = function()
  {
    this.success_cb = function() {};
    this.error_cb   = function() {};
  }
  
  PlugAuth.Tx.prototype.success = function(aFunction) { this.success_cb = aFunction; return this }
  PlugAuth.Tx.prototype.error   = function(aFunction) { this.error_cb   = aFunction; return this }

})();
