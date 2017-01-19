
/* This node module simplifies creating a clustered server.  I have edited the 
implementation, provided through the links below (version 0.04).
I have modified it to allow you to control what the master thread does.

https://github.com/Flipboard/express-cluster
https://github.com/Flipboard/express-cluster/blob/master/lib/index.js 
*/

(function() {
  var cluster, master, os, worker;

  cluster = require("cluster");

  os = require("os");

  /* askitisn: modified to accept master callback function */
  master = function(config, masterCb) {
    var count, i, respawn, worker, workerCount, workers, _i;
    count = parseInt(config.count || process.env.WORKER_COUNT);
    workerCount = count > 0 ? count : os.cpus().length;
    respawn = typeof config.respawn === "undefined" ? true : Boolean(config.respawn);

    /* askitisn: call the master callback function if not null */
    masterCb && masterCb(this);

    workers = [];
    if (config.verbose) {
      console.log("Master started on pid " + process.pid + ", forking " + workerCount + " processes");
    }
    for (i = _i = 0; 0 <= workerCount ? _i < workerCount : _i > workerCount; i = 0 <= workerCount ? ++_i : --_i) {
      worker = cluster.fork();
      if (typeof config.workerListener === "function") {
        worker.on("message", config.workerListener);
      }
      workers.push(worker);
    }
    cluster.on("exit", function(worker, code, signal) {
      var idx;
      if (config.verbose) {
        console.log("" + worker.process.pid + " died with " + (signal || ("exit code " + code)), respawn ? "restarting" : "");
      }
      idx = workers.indexOf(worker);
      if (idx > -1) {
        workers.splice(idx, 1);
      }
      if (respawn) {
        worker = cluster.fork();
        if (typeof config.workerListener === "function") {
          worker.on("message", config.workerListener);
        }
        return workers.push(worker);
      }
    });
    return process.on("SIGQUIT", function() {
      var _j, _len, _results;
      respawn = false;
      if (config.verbose) {
        console.log("QUIT received, will exit once all workers have finished current requests");
      }
      _results = [];
      for (_j = 0, _len = workers.length; _j < _len; _j++) {
        worker = workers[_j];
        _results.push(worker.send("quit"));
      }
      return _results;
    });
  };

  worker = function(fn, worker) {
    var server;
    server = fn(worker);
    if (!server) {
      return;
    }
    if (typeof server.on === "function") {
      server.on("close", function() {
        return process.exit();
      });
    }
    if (typeof server.close === "function") {
      return process.on("message", function(msg) {
        if (msg === "quit") {
          return server.close();
        }
      });
    }
  };

  /* askitisn: modified to include arg3 */
  module.exports = function(arg0, arg1, arg3) {
    var config, fn;

    fn = function() {};
    config = {};
    if (typeof arg0 === 'function') {
      fn = arg0;
      config = arg1 || config;
    } else if (typeof arg1 === 'function') {
      fn = arg1;
      config = arg0 || config;
    }
    if (cluster.isMaster) { 
      /* askitisn: modified to pass in master callback */
      const masterCb=(typeof arg3 === 'function') ? arg3 : null;
      return master(config, masterCb);
    } else {
      return worker(fn, cluster.worker);
    }
  };

}).call(this);
