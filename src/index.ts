import http from 'node:http';
import * as dotenv from 'dotenv';
import { IUser, MethodsTypes } from './types';
import UsersDB from './service/UsersDB';

dotenv.config();

const { PORT } = process.env;

const isCorrectUuidFormat = (testingStr: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(testingStr);
};

const isCorrespondingToUserSchema = (testingObj: any): testingObj is IUser => {
  return (
    'username' in testingObj &&
    typeof testingObj.username === 'string' &&
    'age' in testingObj &&
    typeof testingObj.age === 'number' &&
    'hobbies' in testingObj &&
    typeof testingObj.hobbies === 'object'
  );
};

const server = http.createServer(async (req, res) => {
  const reqUrlParsed = req.url.trim().substring(1).split('/');

  if (reqUrlParsed[0] === 'api') {
    const apiResourceType = reqUrlParsed[1];
    if (apiResourceType === 'users') {
      const resourceUUId = reqUrlParsed[2];
      switch (req.method as MethodsTypes) {
        case MethodsTypes.GET: {
          if (resourceUUId) {
            if (!isCorrectUuidFormat(resourceUUId)) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.statusMessage = 'userId has incorrect format (not uuid)';
              res.write(
                JSON.stringify({
                  status: 400,
                  message: 'userId has incorrect format (not uuid)',
                })
              );
              res.end();
            } else {
              const user = UsersDB.getUser(resourceUUId);
              if (user) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.write(JSON.stringify(user));
                res.end();
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 404;
                res.statusMessage = "record with this id doesn't exist";
                res.write(
                  JSON.stringify({
                    status: 404,
                    message: "record with this id doesn't exist",
                  })
                );
                res.end();
              }
            }
          } else {
            const allUsers = UsersDB.getUser();
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(allUsers));
            res.statusCode = 200;
            res.end();
          }
          break;
        }
        case MethodsTypes.POST: {
          req.setEncoding('utf8');
          const getData = () =>
            new Promise((promRes) => {
              let rawData = '';
              req.on('data', (chunk) => {
                rawData += chunk;
              });
              req.on('end', () => {
                try {
                  promRes(JSON.parse(rawData));
                } catch (e) {
                  console.error(e.message);
                }
              });
            });

          const data = await getData();
          if (isCorrespondingToUserSchema(data)) {
            UsersDB.postUser(data);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 201;
            res.write(
              JSON.stringify({
                status: 201,
                message: 'new user successfully added',
              })
            );
            res.end();
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.statusMessage = 'request body does not contain required fields';
            res.write(
              JSON.stringify({
                status: 400,
                message: 'request body does not contain required fields',
              })
            );
            res.end();
          }
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
  }
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP');
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
