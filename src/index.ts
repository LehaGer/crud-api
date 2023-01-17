import * as dotenv from 'dotenv';
import server from './server';
import { cpus } from 'node:os';
import cluster from 'node:cluster';
import createLoadBalancer from './loadBalancer';

dotenv.config();

const { PORT = '4000', IS_MULTI_MODE } = process.env;

const workersPorts = [];

if (IS_MULTI_MODE === 'false') {
  server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
} else if (IS_MULTI_MODE === 'true') {
  const numCPUs = cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running on port ${PORT}`);
    for (let i = 0; i < numCPUs; i++) {
      const correspondingPort = parseInt(PORT) + i + 1;
      cluster.fork({
        PORT: correspondingPort,
      });
      workersPorts.push(correspondingPort);
    }
    createLoadBalancer(workersPorts).listen(PORT);
    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    server.listen(PORT);
    console.log(`Worker ${process.pid} started on port ${PORT}, id ${cluster.worker.id}`);
  }
}
