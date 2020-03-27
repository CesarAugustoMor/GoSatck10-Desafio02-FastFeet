import Sequelize from 'sequelize';
import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import databaseConfig from '../config/database';

const models = [User, Recipients];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.conection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.conection));
  }
}

export default new Database();
