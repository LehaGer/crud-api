# CRUD API

## Description

CRUD API with load balancing.
- [task requirements](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)
- [task score](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/score.md)

## Installation guide

```
git clone https://github.com/LehaGer/crud-api.git
```
```
git checkout develop
```
```
npm i
```

## Scripts
```
npm start:prod
```
```
npm start:dev
```
```
npm start:multi
```
```
npm test
```

for PORT configuring create .env file in the root dir with corresponding field

## End-points description

1. Implemented endpoint `api/users`:
    - **GET** `api/users` is used to get all persons
        - Server answer with `status code` **200** and all users records
    - **GET** `api/users/{userId}`
        - Server answer with `status code` **200** and record with `id === userId` if it exists
        - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        - Server answer with `status code` **201** and newly created record
        - Server answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    - **PUT** `api/users/{userId}` is used to update existing user
        - Server answer with` status code` **200** and updated record
        - Server answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        - Server answer with `status code` **204** if the record is found and deleted
        - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
2. Requests to non-existing endpoints (e.g. `some-non/existing/resource`) is handled (server answer with `status code` **404** and corresponding human-friendly message)
3. Errors on the server side that occur during the processing of a request are handled and processed correctly (server answer with `status code` **500** and corresponding human-friendly message)
