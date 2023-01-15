import http from 'node:http';
import * as dotenv from 'dotenv';
import { MethodsTypes } from './types';
import UsersDB from './service/UsersDB';

dotenv.config();

const { PORT } = process.env;

const isCorrectUuidFormat = (testingStr: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(testingStr);
};

const server = http.createServer((req, res) => {
  console.log(UsersDB.getUser());
  res.setHeader('Content-Type', 'application/json');

  const reqUrlParsed = req.url.trim().substring(1).split('/');

  if (reqUrlParsed[0] === 'api') {
    const apiResourceType = reqUrlParsed[1];
    if (apiResourceType === 'users') {
      const resourceUUId = reqUrlParsed[2];
      switch (req.method as MethodsTypes) {
        case MethodsTypes.GET: {
          if (resourceUUId) {
            if (!isCorrectUuidFormat(resourceUUId)) {
              res.statusCode = 400;
              res.statusMessage = 'userId has incorrect format (not uuid)';
            } else {
              const user = UsersDB.getUser(resourceUUId);
              if (user) {
                res.statusCode = 200;
                res.write(JSON.stringify(user));
              } else {
                res.statusCode = 404;
                res.statusMessage = "record with this id doesn't exist";
              }
            }
          } else {
            const allUsers = UsersDB.getUser();
            res.write(JSON.stringify(allUsers));
            res.statusCode = 200;
          }
          break;
        }
        case MethodsTypes.POST: {
          // if(UsersDB.postUser())
          // res.write(JSON.stringify(req));
          // console.log(req);
          break;
        }
        case MethodsTypes.PUT: {
          break;
        }
        case MethodsTypes.DELETE: {
          break;
        }
        default: {
          res.write('seems like your request doesnt correspond to any available method');
        }
      }
    }

    // res.write(JSON.stringify(req));
  }

  /*
  url: '/api',
  method: 'GET',
  statusCode: null,
  statusMessage: null,
*/

  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP');
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
