'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Nome do produto
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Referência ao destinatário
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      // Referência ao entregador
      delivery_man_id: {
        type: Sequelize.INTEGER,
        references: { model: 'delivery_mans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      // Referência à uma assinatura do destinatário, que será uma imagem
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      // Data de cancelamento
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // Data de retirada
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // Data de entrega ao destinatário
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // Data de exclusão do registro
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliveries');
  },
};
