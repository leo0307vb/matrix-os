/* jshint -W058 */
// For the protos


var zmq = require('zmq')
var debug = debugLog('zeromq');


var heartbeatSocket = zmq.socket('push');
var heartbeatListener = zmq.socket('pull');

module.exports = {
  heartbeatMonitor : function(cb){
    heartbeatListener.on('message', cb);
  },
  heartbeat: function(msg){
    heartbeatSocket.send(msg);
  },

  deviceInfo: function(cb){
    var request = zmq.socket('req');
    request.on('message', function(resp){
      cb(resp);
    });

    request.connect('tcp://127.0.0.1:' + Matrix.device.port.defaults.info)
    request.send('');
  },

  // Returns zmq connections
  registerComponent: function(driver){
    debug('[zmq][registerComponent|>', driver.name.yellow)
    // use method / feature detection
    var config = zmq.socket('push');
    var error = zmq.socket('sub');
    var update = zmq.socket('sub');
    var ping = zmq.socket('push');
    var o = {};

    if ( _.has(driver, 'send') || _.has(driver, 'prepare') ){
      o.send = config.connect('tcp://127.0.0.1:' + Matrix.device.port.get(driver.name).input);
    }

    if ( _.has(driver, 'error')){
      o.error = error.connect('tcp://127.0.0.1:' + Matrix.device.port.get(driver.name).error);
    }

    if ( _.has(driver, 'read')){
      o.read = update.connect('tcp://127.0.0.1:' + Matrix.device.port.get(driver.name).update);
    }

    if (_.has(driver, 'ping')){
      o.ping = ping.connect('tcp://127.0.0.1:' + Matrix.device.port.get(driver.name).ping);
    }

    return o;
  },

  monitor: function(){
    // Create a socket
    // socket = zmq.socket('req');
    //
    //
    // // Register to monitoring events
    // socket.on('connect', function(fd, ep) {console.log('connect, endpoint:', ep);});
    // socket.on('connect_delay', function(fd, ep) {console.log('connect_delay, endpoint:', ep);});
    // socket.on('connect_retry', function(fd, ep) {console.log('connect_retry, endpoint:', ep);});
    // socket.on('listen', function(fd, ep) {console.log('listen, endpoint:', ep);});
    // socket.on('bind_error', function(fd, ep) {console.log('bind_error, endpoint:', ep);});
    // socket.on('accept', function(fd, ep) {console.log('accept, endpoint:', ep);});
    // socket.on('accept_error', function(fd, ep) {console.log('accept_error, endpoint:', ep);});
    // socket.on('close', function(fd, ep) {console.log('close, endpoint:', ep);});
    // socket.on('close_error', function(fd, ep) {console.log('close_error, endpoint:', ep);});
    // socket.on('disconnect', function(fd, ep) {console.log('disconnect, endpoint:', ep);});
    //
    // // Handle monitor error
    // socket.on('monitor_error', function(err) {
    //     console.log('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
    //     setTimeout(function() { socket.monitor(500, 0); }, 5000);
    // });
    //
    // // Call monitor, check for events every 500ms and get all available events.
    // console.log('Start monitoring...');
    // socket.monitor(500, 0);
    // socket.connect('tcp://127.0.0.1:9991');
    //
    // setTimeout(function() {
    //     console.log('Stop the monitoring...');
    //     socket.unmonitor();
    // }, 20000);
  },
}
