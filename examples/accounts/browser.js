var dnode = require('dnode');

window.onload = function() {
  $('form#login').submit(function (event) {
    event.preventDefault();
    var user = $('input[name="user"]').val();
    init(user);
  });
}; 

var init = function(user) {
  dnode.connect(function(remote) {
      remote.login(user, function(err, res) {
        if (err) $('#error').text(err.Message).show();
        else {
          $('#login').hide();
          $('#loading').show();
          remote.getAllItems(function(err, res) {
            if (!res.length) $('#items').text('No Items');
            else {
              $('#items').append(document.createElement('ul'));
              res.forEach(function(item) {
                var li = $(document.createElement('li')),
                    itemName = item.$ItemName,
                    items = {},
                    itemUL = $(document.createElement('ul')).attr('id', 'ul-'+itemName);
                $('#items > ul').append(li.text(itemName).append(' <a href="/" id="add-'+itemName+'">Add</a>'));
                li.append(itemUL);
                Object.getOwnPropertyNames(item).forEach(function (key, i) {
                  if (key !== '$ItemName') {
                    itemUL.append($(document.createElement('li')).append('<span id="' + key + '">Name: ' + key + ' Value: ' + item[key] +  ' <a href="/" id="edit-' + key +'">Edit</a> <a href="/" id="del-' + key +'">Remove</a></span>').attr('id', 'li-' + key));
                    items[itemName]
                    $('#li-'+itemName).append($(document.createElement('form')).attr('id', 'form-'+itemName).append($(document.createElement('input')).attr('type', 'text').attr('name', 'attrName').val(key)).append($(document.createElement('input')).attr('type', 'text').attr('name', 'attrValue').val(item[key])).append('<input type="submit" value="Save" />').hide());
                  }
                }); 
                
                $('a#add-'+itemName).live('click', function(event) {
                  event.preventDefault();
                  console.log(itemName)
                  $('#ul-'+itemName).append($(document.createElement('form')).attr('id', 'form-'+itemName));
                  $('#form-'+itemName).append($(document.createElement('input')).attr('type', 'text').attr('name', 'attrName'));
                  $('#form-'+itemName).append($(document.createElement('input')).attr('type', 'text').attr('name', 'attrValue'));
                  $('#form-'+itemName).append('<input type="submit" value="Save" />');
                });
                
                $('a[id^=edit-]').live('click', function(event) {
                  event.preventDefault();
                  
                  $('#span-'+itemName).hide();
                  $('#form-'+itemName).show();
                });
                
                $('#form-'+itemName).live('submit', function(event) {
                  event.preventDefault();
                  var attr = {}, self = this;
                  var name = $('#form-'+itemName+' > input[name=attrName]').val();
                  attr[name] = $('#form-'+itemName+' > input[name=attrValue]').val();
                  remote.putItem(itemName, attr, function(err, res) {
                    if (err) return $('#error').text(err).show();
                    $(self).remove();
                    itemUL.append($(document.createElement('li')).text('Name: ' + name + ' Value: ' + attr[name]).attr('id', 'li-' + name).append(' <a href="/" id="edit-' + name +'">Edit</a> <a href="/" id="del-' + name +'">Remove</a>'));
                  });
                });
              });
            }
            $('#loading').hide();
            $('#items').show();
            
            
            
          });
        }
      });
  });
  
};
