import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 9);
      }
    });
    return this;
  }

  checkSenha(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default User;
