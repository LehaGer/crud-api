import { IUser } from '../types';

export const isCorrectUuidFormat = (testingStr: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(testingStr);
};

export const isCorrespondingToUserSchema = (testingObj: any): testingObj is IUser => {
  return (
    'username' in testingObj &&
    typeof testingObj.username === 'string' &&
    'age' in testingObj &&
    typeof testingObj.age === 'number' &&
    'hobbies' in testingObj &&
    typeof testingObj.hobbies === 'object'
  );
};

export const getData = (req) =>
  new Promise((promRes) => {
    req.setEncoding('utf8');
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
