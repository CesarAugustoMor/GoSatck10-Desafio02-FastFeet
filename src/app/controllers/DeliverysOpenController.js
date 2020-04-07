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
        where: { delivery_man_id: req.params.idDeliveryMan },
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
}

export default new DeliverysOpenController();
