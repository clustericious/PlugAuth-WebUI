if(PlugAuth === undefined) var PlugAuth = {};
if(PlugAuth.UI === undefined) PlugAuth.UI = {};

(function ()
{
  var counter = 0;

  PlugAuth.UI.Modal = function(title)
  {
    this.title = title;
    this.index = counter++;
    this.ready = false;

    $('body').append('<div class="modal hide fade" id="plugauth_webui_modal_' + this.index + '">'
    +                '  <div class="modal-header">'
    +                '    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
    +                '    <h3>' + title + '</h3>'
    +                '  </div>'
    +                '  <div class="modal-body" id="plugauth_webui_modal_' + this.index + '_body">'
    +                '  </div>'
    +                '  <div class="modal-footer" id="plugauth_webui_modal_' + this.index + '_footer">'
    +                '    <a href="#" class="btn" id="plugauth_webui_modal_' + this.index + '_close">Close</a>'
    +                '  </div>'
    +                '</div>');

    var modal = this;
    $('#plugauth_webui_modal_' + this.index + '_close').click(function() {
      modal.hide();
    });
  }
  
  PlugAuth.UI.Modal.prototype.html = function(html)
  {
    $('#plugauth_webui_modal_' + this.index + '_body').html(html);
  }
  
  PlugAuth.UI.Modal.prototype.show = function()
  {
    $('#plugauth_webui_modal_' + this.index).modal('show');
  }
  
  PlugAuth.UI.Modal.prototype.hide = function()
  {
    $('#plugauth_webui_modal_' + this.index).modal('hide');
  }
  
  var counter2 = 0;
  
  PlugAuth.UI.Modal.prototype.add_button = function(label, button_class)
  {
    var index = counter2++;
    var html = '<button id="plugauth_webui_modal_button_' + index + '" class="btn ' + button_class;
    html += '" type="button">' + label + '</button>';
  
    $('#plugauth_webui_modal_' + this.index + '_footer').prepend(html);
    return $('#plugauth_webui_modal_button_' + index);
  }
  
  PlugAuth.UI.Modal.prototype.on = function(event_name, callback)
  {
    $('#plugauth_webui_modal_' + this.index).on(event_name, callback);
  }

})();
