import http from 'node:http';
import * as dotenv from 'dotenv';
import { getData } from '../customFunctions';
import cluster from 'node:cluster';

dotenv.config();

const createLoadBalancer = (availableWorkersPorts: number[]) => {
  let operationSequence = 0;
  const getCurrentWorkerPort = () => {
    return availableWorkersPorts[operationSequence++ % availableWorkersPorts.length];
  };

  return http.createServer(async (request, response) => {
    const currentWorkerPort = getCurrentWorkerPort();
    try {
      const data = JSON.stringify(await getData(request));
      const options = {
        port: currentWorkerPort,
        path: request.url,
        method: request.method,
        headers: {
          ...request.headers,
          'Content-Length': Buffer.byteLength(data),
        },
      };

      const workerRequest = http.request(options, async (workerResponse) => {
        const workerResponseData = await getData(workerResponse);
        response.setHeader('Content-Type', workerResponse.headers['content-type']);
        response.statusCode = workerResponse.statusCode;
        response.statusMessage = workerResponse.statusMessage;
        response.write(JSON.stringify(workerResponseData));
        response.end();
      });
      workerRequest.on('error', (e) => {
        throw new Error(e.message);
      });
      workerRequest.write(data);
      workerRequest.end();
    } catch (exception) {
      switch (exception.name) {
        case 'Error': {
          console.error(exception.message);
          response.setHeader('Content-Type', 'text/html');
          response.statusCode = 500;
          response.statusMessage = 'internal server error';
          response.write('<h1>some server-side error has been occurred 😢</h1>');
          response.end();
          break;
        }
        case 'IncorrectPathException': {
          response.setHeader('Content-Type', 'text/html');
          response.statusCode = 404;
          response.statusMessage = 'The path is incorrect';
          response.write(`<h1>${exception.message}</h1>`);
          response.end();
          break;
        }
      }
    }
  });
};

export default createLoadBalancer;
