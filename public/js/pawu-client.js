if(PlugAuth === undefined) var PlugAuth = {};

(function ()
{
  PlugAuth.Client = function(aUrl)
  {
    this.url = aUrl.replace(/\/$/, '');
  }
  
  PlugAuth.Client.prototype.login = function(aUsername, aPassword)
  {
    this.user = aUsername;
    this.pass = aPassword;
    return this;
  }
  
  PlugAuth.Client.prototype.logout = function()
  {
    delete this.user;
    delete this.pass;
    return this;
  }
  
  var request = function(client, args)
  {
    args = jQuery.extend({}, args);
    if(! (client.user === undefined) )   
    {
      var hash = $.base64.encode(client.user + ':' + client.pass);
      args.beforeSend = function(req) {
        req.setRequestHeader('Authorization', 'Basic ' + hash);
      }
    }
    
    args.url = client.url + args.url;
    
    var tx = new PlugAuth.Client.Tx();
    
    $.ajax(args)
     .success(function(aData, textStatus, jqXHR)        
              { 
                var data;
                if(jqXHR.getResponseHeader('Content-Type') == 'application/json')
                {
                  data = JSON.parse(jqXHR.responseText);
                }
                else
                {
                  data = aData;
                }
                tx.success_cb(data, jqXHR.status);
              })
     .error  (function(jqXHR, textStatus, errorThrown) 
              { tx.error_cb(jqXHR.responseText, jqXHR.status) });
     
    return tx;
  }
  
  PlugAuth.Client.prototype.version = function()
  {
    return request(this, {
      url:    '/version',
      type:   'GET',
    });
  }
  
  PlugAuth.Client.prototype.auth = function()
  {
    return request(this, {
      url:    '/auth',
      type:   'GET',
    });
  }
  
  PlugAuth.Client.prototype.api = function()
  {
    return request(this, {
      url:    '/api',
      type:   'GET',
    });
  }
  
  PlugAuth.Client.prototype.welcome = function()
  {
    return request(this, {
      url:    '/',
      type:   'GET',
    });
  }
  
  PlugAuth.Client.prototype.authz = function(aUser, aAction, aResource)
  {
    return request(this, {
      url:    '/authz/user/' + [ aUser, aAction, aResource ].join('/'),
      type:   'GET',
    });
  }
  
  PlugAuth.Client.prototype.can = function(aAction, aResource)
  {
    return this.authz(this.user, aAction, aResource);
  }
  
  PlugAuth.Client.prototype.user_list = function()
  { return request(this, { url: '/user', type:  'GET' }) }
  PlugAuth.Client.prototype.group_list = function()
  { return request(this, { url: '/group', type: 'GET' }) }
  
  PlugAuth.Client.prototype.create_user = function(aUsername, aPassword)
  {
    return request(this, { 
      url:    '/user', 
      type:   'POST',
      data:   { user: aUsername, password: aPassword },
    });
  }
  
  PlugAuth.Client.prototype.change_password = function(aUsername, aPassword)
  {
    return request(this, {
      url:  '/user/' + aUsername,
      type: 'POST',
      data: { password: aPassword },
    });
  }
  
  PlugAuth.Client.prototype.delete_user = function(aUsername)
  {
    return request(this, {
      url: '/user/' + aUsername,
      type: 'DELETE',
    });
  }
  
  PlugAuth.Client.prototype.groups = function(aUsername)
  {
    return request(this, {
      url: '/groups/' + aUsername,
      type: 'GET',
    });
  }
  
  PlugAuth.Client.prototype.users = function(aGroupname)
  {
    return request(this, {
      url: '/users/' + aGroupname,
      type: 'GET',
    });
  }
  
  PlugAuth.Client.prototype.update_group = function(aGroupname, aUserlist)
  {
    return request(this, {
      url:  '/group/' + aGroupname,
      type: 'POST',
      data: { users: aUserlist.join(',') },
    });
  }

  PlugAuth.Client.prototype.group_add_user = function(aGroupname, aUser)
  {
    return request(this, {
      url: '/group/' + aGroupname + '/' + aUser,
      type: 'POST',
    });
  }
  
  PlugAuth.Client.prototype.group_delete_user = function(aGroupname, aUser)
  {
    return request(this, {
      url: '/group/' + aGroupname + '/' + aUser,
      type: 'DELETE',
    });
  }
  
  PlugAuth.Client.prototype.create_group = function(aGroupname, aUserlist)
  {
    return request(this, {
      url:  '/group',
      type: 'POST',
      data: { group: aGroupname, users: aUserlist.join(',') },
    });
  }
  
  PlugAuth.Client.prototype.delete_group = function(aGroupname)
  {
    return request(this, {
      url:  '/group/' + aGroupname,
      type: 'DELETE',
    });
  }
  
  PlugAuth.Client.prototype.granted = function()
  {
    return request(this, {
      url:  '/grant',
      type: 'GET',
    });
  }
  
  PlugAuth.Client.prototype.revoke = function(aUsername, aAction, aResource)
  {
    return request(this, {
      url: '/grant/' + aUsername + '/' + aAction + '/' + aResource,
      type: 'DELETE',
    });
  }
  
  PlugAuth.Client.prototype.actions = function()
  {
    return request(this, {
      url:  '/actions',
      type: 'GET',
    });
  }
  
  PlugAuth.Client.prototype.grant = function(aUsername, aAction, aResource)
  {
    return request(this, {
      url:  '/grant/' + aUsername + '/' + aAction + '/' + aResource,
      type: 'POST',
    });
  }
  
  /* TODO

     host_tag => GET /host/:host/:tag
     resources => GET /authz/resources/:user/:action/:regex

   */

  /* TODO make *_cb arrays so we can have multiple callbacks */
  PlugAuth.Client.Tx = function()
  {
    this.success_cb = function() {};
    this.error_cb   = function() {};
  }

  PlugAuth.Client.Tx.prototype.success = function(aFunction) { this.success_cb = aFunction; return this }
  PlugAuth.Client.Tx.prototype.error   = function(aFunction) { this.error_cb   = aFunction; return this }

})();
