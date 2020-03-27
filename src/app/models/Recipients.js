import Sequelize, { Model } from 'sequelize';

class Recipients extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: { type: Sequelize.STRING, allowNull: false },
        rua: { type: Sequelize.STRING, allowNull: false },
        numero: { type: Sequelize.NUMBER },
        complemento: { type: Sequelize.STRING },
        bairro: { type: Sequelize.STRING, allowNull: false },
        cidade: { type: Sequelize.STRING, allowNull: false },
        estado: { type: Sequelize.STRING, allowNull: false },
        cep: { type: Sequelize.NUMBER, allowNull: false },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Recipients;
