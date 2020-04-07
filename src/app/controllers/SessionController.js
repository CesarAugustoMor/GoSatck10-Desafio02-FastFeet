import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import DeliveryMan from '../models/DeliveryMan';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      const schema = Yup.object().shape({
        email: Yup.number().required(),
      });
      if (await schema.isValid(req.body)) {
        if (!(await DeliveryMan.findByPk(req.body.email))) {
          return res.status(401).json({ error: 'Entregador não encontrado' });
        }
        return res.json({
          deliveryMan: {
            id: req.body.email,
          },
          token: jwt.sign({ id: req.body.email }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        });
      }

      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario não encontrado' });
    }

    if (!(await user.checkSenha(senha))) {
      return res.status(401).json({ error: 'Senha não bate' });
    }

    const { id, nome } = user;

    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
