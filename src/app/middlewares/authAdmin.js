import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (user.administrador) {
    return res.status(401).json({ erro: 'Permição negada!' });
  }
  console.log('------------------------------------');
  console.log('Acesso administrador concedido id:', req.userId);
  console.log('------------------------------------');

  return next();
};
