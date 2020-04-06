import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliverys from '../models/Deliverys';
import File from '../models/File';

class DeliverysController {
  async index(req, res) {
    const { page = 1 } = req.query;
    return res.json(
      await Deliverys.findAll({
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['path', 'url'],
          },
        ],
      })
    );
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      avatar_id: Yup.number(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    if (
      await Deliverys.findOne({
        where: { email: req.body.email },
      })
    ) {
      return res.status(400).json({ erro: 'Entregador já existente.' });
    }

    if (
      await Deliverys.findOne({
        where: { email: req.body.email },
        paranoid: false,
      })
    ) {
      return res.status(409).json({
        erro: 'Entregador já existente anteriormente. Contate Administração.',
      });
    }
    return res.json(delivery);
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      avatar_id: Yup.number().nullable(),
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    const { email } = req.body;
    const entregador = await Deliverys.findByPk(req.params.id);
    if (!entregador) {
      return res.status(400).json({ erro: 'Entregador não Existe.' });
    }
    if (
      email &&
      email !== entregador.email &&
      (await Deliverys.findOne({
        where: { email },
      }))
    ) {
      return res
        .status(400)
        .json({ erro: 'E-mail já utilizado por outro entregador.' });
    }

    const { id, name, avatar_id } = await entregador.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }
  async delete(req, res) {
    if (
      (await Deliverys.destroy({
        where: { id: req.params.id },
      })) === 0
    ) {
      return res.status(400).json({ erro: 'Id não encontrado!' });
    }
    return res.json();
  }
}

export default new DeliverysController();
