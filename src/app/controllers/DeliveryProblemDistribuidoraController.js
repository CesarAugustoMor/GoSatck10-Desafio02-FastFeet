import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipients';
import File from '../models/File';
import DeliveriesProblem from '../models/DeliveriesProblem';

import CancelationDelivery from '../jobs/CancelationDelivery';
import Queue from '../../lib/Queue';

class DeliveryProblemDistribuidoraController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const tamanhoPagina = 20;
    return res.json(
      await DeliveriesProblem.findAll({
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
  async delete(req, res) {
    const problem = await DeliveriesProblem.findByPk(req.params.id);
    if (!problem) {
      return res.status(400).json({ erro: 'Problema não encontrado!' });
    }
    const encomenda = await Delivery.findByPk(problem.delivery_id);
    if (!encomenda) {
      return res.status(400).json({ erro: 'encomenda não encontrado!' });
    }
    const date = new Date().toISOString();
    encomenda.update({ canceled_at: date });
    const { id, signature_id, start_date, end_date, canceled_at } = encomenda;

    // envia email pro entregador informando o cancelamento
    const delivery = await Delivery.findByPk(problem.delivery_id, {
      attributes: ['product'],
      include: [
        {
          model: DeliveryMan,
          as: 'deliveryMan',
          attributes: ['nome', 'email'],
        },
        { model: Recipients, as: 'recipient', attributes: ['nome'] },
      ],
    });
    await Queue.add(CancelationDelivery.key, { delivery, problem });

    return res.json({
      id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    });
  }
}

export default new DeliveryProblemDistribuidoraController();
