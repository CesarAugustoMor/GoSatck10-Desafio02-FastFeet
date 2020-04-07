import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipients';
import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const tamanhoPagina = 20;
    return res.json(
      await Delivery.findAll({
        limit: tamanhoPagina,
        offset: (page - 1) * tamanhoPagina,
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
      })
    );
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      produto: Yup.string().required(),
      destinatarioId: Yup.number().required(),
      entregadorId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }
    const {
      produto: product,
      entregadorId: delivery_man_id,
      destinatarioId: recipient_id,
    } = req.body;

    if (!(await DeliveryMan.findByPk(delivery_man_id))) {
      return res.status(400).json({ erro: 'Entregador Não existente.' });
    }

    if (!(await Recipients.findByPk(recipient_id))) {
      return res.status(400).json({
        erro: 'Destinatario não encontrado.',
      });
    }

    const { id, signature_id, start_date, end_date } = await Delivery.create({
      product,
      delivery_man_id,
      recipient_id,
    });

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: DeliveryMan,
          as: 'deliveryMan',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: ['nome'],
        },
      ],
      attributes: ['id', 'product'],
    });
    await Queue.add(NewDeliveryMail.key, { delivery });

    return res.json({
      id,
      produto: product,
      entregadorId: delivery_man_id,
      destinatarioId: recipient_id,
      assinaturaId: signature_id,
      start_date,
      end_date,
    });
  }
  async update(req, res) {
    const encomenda = await DeliveryMan.findByPk(req.params.id);
    if (!encomenda) {
      return res.status(400).json({ erro: 'Encomenda não Existe.' });
    }
    const schema = Yup.object().shape({
      produto: Yup.string(),
      destinatarioId: Yup.number(),
      entregadorId: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    const {
      produto: product,
      entregadorId: delivery_man_id,
      destinatarioId: recipient_id,
    } = req.body;
    if (!(await DeliveryMan.findByPk(delivery_man_id))) {
      return res.status(400).json({ erro: 'Entregador Não existente.' });
    }

    if (!(await Recipients.findByPk(recipient_id))) {
      return res.status(400).json({
        erro: 'Destinatario não encontrado.',
      });
    }

    const { id, signature_id, start_date, end_date } = await encomenda.update({
      product,
      delivery_man_id,
      recipient_id,
    });

    return res.json({
      id,
      produto: product,
      entregadorId: delivery_man_id,
      destinatarioId: recipient_id,
      assinaturaId: signature_id,
      start_date,
      end_date,
    });
  }
  async delete(req, res) {
    if (
      (await Delivery.destroy({
        where: { id: req.params.id },
      })) === 0
    ) {
      return res.status(400).json({ erro: 'Id não encontrado!' });
    }
    return res.send();
  }
}

export default new DeliveryController();
