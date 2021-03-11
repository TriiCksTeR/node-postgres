
import Sequelize, { Model } from 'sequelize';
import database from '../database/index'

class User extends Model { }
User.init(
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
  },
  {
    modelName: "user",
    sequelize: database.connection,
    freezeTableName: true,
  }
);

export default User;

//sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string,password:number