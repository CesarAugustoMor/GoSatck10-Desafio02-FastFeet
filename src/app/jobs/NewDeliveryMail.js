import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }
  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryMan.nome} <${delivery.deliveryMan.email}>`,
      subject: 'Nova Entrega!',
      template: 'newDelivery',
      context: {
        entregador: delivery.deliveryMan.nome,
        destinatario: delivery.recipient.nome,
        produto: delivery.product,
      },
    });
  }
}

export default new NewDeliveryMail();
