import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (!user) {
    return res.status(401).json({ erro: 'Permição negada!' });
  }
  console.info('------------------------------------');
  console.info('Acesso Usuario concedido id:', req.userId);
  console.info('------------------------------------');

  return next();
};
