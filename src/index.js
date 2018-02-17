const cluster = require('cluster');
const CPU_COUNT = 1;

if (cluster.isMaster) {
  for (i = 0; i < CPU_COUNT; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', worker => {
    // eslint-disable-next-line no-console
    console.log(`> Worker ${worker.id} died :(`);
    cluster.fork();
  });
} else if (require.main === module) {
  // eslint-disable-next-line global-require
  require('./bot');
}
