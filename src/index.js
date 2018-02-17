const spawn = require('child_process').spawn;

let server = null;

function startServer(){
  console.log('start server');
  server = spawn('node',['bot.js']);
  console.log('node js pid is '+server.pid);
  server.on('close',function(code,signal){
    server.kill(signal);
    server = startServer();
  });
  server.on('error',function(code,signal){
    server.kill(signal);
    server = startServer();
  });
  return server;
};

startServer();