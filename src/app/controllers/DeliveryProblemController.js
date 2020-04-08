import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipients';
import File from '../models/File';
import DeliveriesProblem from '../models/DeliveriesProblem';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const tamanhoPagina = 20;
    return res.json(
      await DeliveriesProblem.findAll({
        where: { delivery_id: req.params.id },
        limit: tamanhoPagina,
        offset: (page - 1) * tamanhoPagina,
        include: [
          {
            model: Delivery,
            as: 'delivery',
            include: [
              {
                model: DeliveryMan,
                as: 'deliveryMan',
                attributes: ['id', 'nome', 'email'],
                include: [
                  {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'nome', 'path', 'url'],
                  },
                ],
              },
              {
                model: Recipients,
                as: 'recipient',
                attributes: [
                  'id',
                  'nome',
                  'rua',
                  'bairro',
                  'cidade',
                  'estado',
                  'cep',
                ],
              },
              {
                model: File,
                as: 'signature',
                attributes: ['id', 'nome', 'path', 'url'],
              },
            ],
            attributes: ['id', 'product', 'start_date', 'end_date'],
          },
        ],
        attributes: ['id', 'description'],
      })
    );
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    if (!(await Delivery.findByPk(req.params.id))) {
      return res.status(400).json({ erro: 'Entrega não encontrada!' });
    }

    const { id, description, delivery_id } = await DeliveriesProblem.create({
      description: req.body.description,
      delivery_id: req.params.id,
    });

    return res.json({ id, description, delivery_id });
  }
}

export default new DeliveryProblemController();
