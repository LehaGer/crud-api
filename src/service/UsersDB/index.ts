import { IUser, IUserIdType } from '../../types';
import { v4 } from 'uuid';

class UsersDB {
  private static _users: IUser[] = [
    {
      id: v4(),
      username: 'Ted',
      age: 25,
      hobbies: ['swimming', 'basketball'],
    },
  ];

  public static getUser(uuid?: IUserIdType) {
    return uuid ? this._users.filter((user) => user.id === uuid)[0] : this._users;
  }

  public static postUser(newUser: IUser) {
    this._users = [
      ...this._users,
      {
        id: v4(),
        ...newUser,
      },
    ];
    return true;
  }

  public static putUser(uuid: IUserIdType, newUsersData) {
    this._users = this._users.filter((user) => user.id === uuid)[0] = {
      ...this._users.filter((user) => user.id === uuid)[0],
      ...newUsersData,
    };
    return true;
  }

  public static deleteUser(uuid) {
    this._users = this._users.filter((user) => user !== uuid);
    return true;
  }
}

export default UsersDB;
