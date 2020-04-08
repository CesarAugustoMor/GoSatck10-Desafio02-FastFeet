import { Op } from 'sequelize';
import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO, isWithinInterval } from 'date-fns';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipients from '../models/Recipients';
import File from '../models/File';

class DeliverysOpenController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const tamanhoPagina = 20;
    return res.json(
      await Delivery.findAll({
        where: {
          delivery_man_id: req.params.idDeliveryMan,
          end_date: {
            [Op.is]: null,
          },
        },
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
  async update(req, res) {
    const entregador = await DeliveryMan.findByPk(req.params.idDeliveryMan);
    if (!entregador) {
      return res.status(400).json({ erro: 'Entregador não Existe.' });
    }
    const encomenda = await Delivery.findByPk(req.params.idDelivery);
    if (!encomenda) {
      return res.status(400).json({ erro: 'Encomenda não Existe.' });
    }
    if (encomenda.delivery_man_id != req.params.idDeliveryMan) {
      return res
        .status(400)
        .json({ erro: 'Você não é o responsavel desta encomenda.' });
    }
    const { start_date, end_date, signature_id } = req.body;
    const date = start_date ? parseISO(start_date) : parseISO(end_date);

    const encomendas = await Delivery.findAndCountAll({
      where: {
        delivery_man_id: req.params.idDeliveryMan,
        start_date: {
          [Op.between]: [
            startOfDay(date).toISOString(),
            endOfDay(date).toISOString(),
          ],
        },
      },
    });
    if (encomendas.count >= 5) {
      return res
        .status(400)
        .json({ erro: 'Você não pode fazer mais entregas hoje.' });
    }

    const schema = Yup.object().shape({
      start_date: Yup.date().nullable(),
      end_date: Yup.date(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }
    // valida hora da retirada do produto pelo entregador
    const now = new Date();
    const morning = new Date().setHours(8, 0, 0);
    const afternoon = new Date().setHours(18, 0, 0);
    const periodValid = isWithinInterval(now, {
      start: morning,
      end: afternoon,
    });
    if (!periodValid) {
      return res.status(400).json({
        error: 'Retirada do produto só pode ser feita das 08:00h às 18:00h',
      });
    }

    if (start_date) {
      // valida hora da retirada do produto pelo entregador
      const morning = new Date().setHours(8, 0, 0);
      const afternoon = new Date().setHours(18, 0, 0);
      const periodValid = isWithinInterval(date, {
        start: morning,
        end: afternoon,
      });
      if (!periodValid) {
        return res.status(400).json({
          error: 'Retirada do produto só pode ser feita das 08:00h às 18:00h',
        });
      }
      const {
        id,
        signature_id,
        start_date: data_inicial,
        end_date,
      } = await encomenda.update({ start_date });
      return res.json({
        id,
        signature_id,
        start_date: data_inicial,
        end_date,
      });
    }
    if (end_date) {
      const {
        id,
        signature_id: assinatura,
        start_date,
        end_date: data_final,
      } = await encomenda.update({ end_date, signature_id });
      return res.json({
        id,
        signature_id: assinatura,
        start_date,
        end_date: data_final,
      });
    }
  }
}

export default new DeliverysOpenController();
