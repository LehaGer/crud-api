import { MethodsTypes } from '../types';
import http from 'node:http';
import UsersDB from '../service/UsersDB';
import { getData, isCorrectUuidFormat, isCorrespondingToUserSchema } from '../customFunctions';

const server = http.createServer(async (req, res) => {
  try {
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
                  res.statusMessage = 'user(s) successfully founded';
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
            if (resourceUUId) {
              throw {
                name: 'IncorrectPathException',
                message: 'The path is incorrect 😢',
              };
            }
            const data = await getData(req);
            if (isCorrespondingToUserSchema(data)) {
              UsersDB.postUser(data);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.statusMessage = 'successfully added';
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
            if (!resourceUUId) {
              throw {
                name: 'IncorrectPathException',
                message: 'The path is incorrect 😢',
              };
            }
            if (!isCorrectUuidFormat(resourceUUId)) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.statusMessage = 'userId is invalid (not uuid)';
              res.write(
                JSON.stringify({
                  status: 400,
                  message: 'userId is invalid (not uuid)',
                })
              );
              res.end();
              break;
            }
            if (!UsersDB.getUser(resourceUUId)) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 404;
              res.statusMessage = "record with id === userId doesn't exist";
              res.write(
                JSON.stringify({
                  status: 404,
                  message: "record with id === userId doesn't exist",
                })
              );
              res.end();
              break;
            }
            const data = await getData(req);
            UsersDB.putUser(resourceUUId, data);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.statusMessage = 'successfully updating';
            res.write(
              JSON.stringify({
                status: 200,
                message: "user's record was successfully updated",
              })
            );
            res.end();
            break;
          }
          case MethodsTypes.DELETE: {
            if (!resourceUUId) {
              throw {
                name: 'IncorrectPathException',
                message: 'The path is incorrect 😢',
              };
            }
            if (!isCorrectUuidFormat(resourceUUId)) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.statusMessage = 'userId is invalid (not uuid)';
              res.write(
                JSON.stringify({
                  status: 400,
                  message: 'userId is invalid (not uuid)',
                })
              );
              res.end();
              break;
            }
            if (!UsersDB.getUser(resourceUUId)) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 404;
              res.statusMessage = "record with id === userId doesn't exist";
              res.write(
                JSON.stringify({
                  status: 404,
                  message: "record with id === userId doesn't exist",
                })
              );
              res.end();
              break;
            }
            UsersDB.deleteUser(resourceUUId);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 204;
            res.statusMessage = "successfully record's deleting";
            res.write(
              JSON.stringify({
                status: 204,
                message: "user's record was successfully deleted",
              })
            );
            res.end();
            break;
          }
          default: {
            throw {
              name: 'IncorrectPathException',
              message: 'seems like your request doesnt correspond to any available method 😢',
            };
          }
        }
      } else {
        throw {
          name: 'IncorrectPathException',
          message: 'The path is incorrect 😢',
        };
      }
    } else {
      throw {
        name: 'IncorrectPathException',
        message: 'The path is incorrect 😢',
      };
    }
  } catch (exception) {
    switch (exception.name) {
      case 'Error': {
        console.error(exception.message);
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 500;
        res.statusMessage = 'internal server error';
        res.write('<h1>some server-side error has been occurred 😢</h1>');
        res.end();
        break;
      }
      case 'IncorrectPathException': {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 404;
        res.statusMessage = 'The path is incorrect';
        res.write(`<h1>${exception.message}</h1>`);
        res.end();
        break;
      }
    }
  }
});

/*
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});*/

export default server;
