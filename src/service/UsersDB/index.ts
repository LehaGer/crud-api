import { IUser, IUserIdType } from '../../types';
import { v4 } from 'uuid';

class UsersDB {
  /**
   * Array of user's objects im formst:
   * [
   *   {
   *     id: v4(),
   *     username: 'Ted',
   *     age: 25,
   *     hobbies: ['swimming', 'basketball'],
   *   },
   * ];
   **/
  private static _users: IUser[] = [
    {
      id: 'f1c5bcff-b26d-4204-a6c5-dbf784a7262d',
      username: 'Teddd',
      age: 27,
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
    this._users.forEach((user, index) => {
      if (user.id === uuid) {
        this._users[index] = {
          ...user,
          ...newUsersData,
        };
      }
    });
    return true;
  }

  public static deleteUser(uuid) {
    this._users = this._users.filter((user) => user.id !== uuid);
    return true;
  }
}

export default UsersDB;
