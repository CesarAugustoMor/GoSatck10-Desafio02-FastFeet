const bcrypt = require('bcryptjs');

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          nome: 'Distribuidora FastFeet',
          email: 'admin@fastfeet.com',
          senha_hash: bcrypt.hashSync('123456', 8),
          administrador: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
