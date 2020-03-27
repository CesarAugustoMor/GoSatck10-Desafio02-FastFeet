import * as Yup from 'yup';
import User from '../models/User';
class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      senha: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação dos dados falhou!' });
    }

    const UsuarioExiste = await User.findOne({
      where: { email: req.body.email },
    });

    if (UsuarioExiste) {
      return res.status(400).json({ erro: 'Usuario já existente.' });
    }

    const { id, nome, email } = await User.create(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldSenha: Yup.string().min(6),
      senha: Yup.string()
        .min(6)
        .when('oldSenha', (oldSenha, field) =>
          oldSenha ? field.required() : field
        ),
      confirmSenha: Yup.string().when('senha', (senha, field) =>
        senha ? field.required().oneOf([Yup.ref('senha')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    const { email, oldSenha } = req.body;
    const user = await User.findByPk(req.userId);
    if (
      email &&
      email !== user.email &&
      (await User.findOne({
        where: { email },
      }))
    ) {
      return res
        .status(400)
        .json({ erro: 'E-mail já utilizado por outro usuário.' });
    }

    if (oldSenha && !(await user.checkSenha(oldSenha))) {
      return res.status(401).json({ erro: 'Senha não combina' });
    }
    const { id, nome } = await user.update(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }
}

export default new UserController();
