var simpledb = require('simpledb'),
  connect = require('connect'),
  browserify = require('browserify'),
  dnode = require('dnode'),
  sdb = new simpledb.SimpleDB({
    keyid: 'keyid',
    secret: 'secret'
  });
  
var server = connect.createServer();

server.use(connect.static(__dirname));

server.use(browserify({
  require: 'dnode',
  mount: '/simpledb.js',
}));

dnode(function(client) {
  var that = this;
  var excluded = {keyid: 1, secret: 1, client: 1};
  Object.getOwnPropertyNames(sdb).forEach(function (key) {
    if (!excluded[key]) {
      that[key] = sdb[key].bind(this);
    }
  });
}).listen(server);

server.listen(9001);
console.log('http://localhost:9001');