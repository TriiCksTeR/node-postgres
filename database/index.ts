import Sequelize from 'sequelize';

const config = require('./config');

class Database {
  public connection: Sequelize.Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize.Sequelize(config);
  }
}

const database: Database = new Database();

export default database;