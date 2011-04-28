var simpledb = require('simpledb'),
  connect = require('connect'),
  browserify = require('browserify'),
  dnode = require('dnode'),
  sdb = new simpledb.SimpleDB({
    keyid: 'secret',
    secret: 'secret'
  });
  
var server = connect.createServer();

server.use(connect.static(__dirname));

server.use(browserify({
  require: ['dnode'],
  mount: '/simpledb.js',
  entry: [__dirname + "/browser.js", __dirname + "/vendor/jquery-1.5.2.js"]
}));

var createUserDomain = function(user, cb) {
  sdb.createDomain(user, function(err, res, meta) {
    if (err) return cb(err);
    cb(null, res);
  });
};

dnode(function(client) {
  var self = this;
  var domain = null;
  
  this.login = function(user, cb) {
    domain = user;
    sdb.domainMetadata(user, function(err, res, meta) {
      if (err && err.Code === 'NoSuchDomain') {
        createUserDomain(user, function(err, res) {
          if (err) return cb(err);
        });
      } else if (err) {
        cb(err);
      }
      cb(null, true);
    });
  };
  
  this.putItem = function(name, attr, cb) {
    if (domain === null) return cb('You must login with a username');
    sdb.putItem(domain, name, attr, function(err, res) {
      cb(err, res);
    });
  };
  
  this.batchPutItem = function(items, cb) {
    if (domain === null) return cb('You must login with a username');
    sdb.batchPutItems(domain, items, function(err, res) {
      cb(err, res);
    });
  };
  
  this.getItem = function(name, cb) {
    if (domain === null) return cb('You must login with a username');
    sdb.getItem(domain, name, function(err, res) {
      cb(err, res);
    });
  };
  
  this.deleteItem = function(name, attr, cb) {
    if (domain === null) return cb('You must login with a username');
    if (typeof attr === 'function') {
      cb = attr;
      attr = null;
    }
    sdb.deleteItem(domain, name, attr, function(err, res) {
      cb(err, res);
    });
  };
  
  this.getAllItems = function(cb) {
    if (domain === null) return cb('You must login with a username');
    sdb.select("select * from `" + domain + '`', function(err, res, meta) {
      console.log(err, res);
      cb(err, res);
    });
  };
}).listen(server);

server.listen(9001);
console.log('http://localhost:9001');