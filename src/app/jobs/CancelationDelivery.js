import Mail from '../../lib/Mail';

class CancelationDelivery {
  get key() {
    return 'CancelationDelivery';
  }
  async handle({ data }) {
    const { delivery, problem } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryMan.nome} <${delivery.deliveryMan.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelation_delivery',
      context: {
        deliveryman: delivery.deliveryMan.nome,
        recipient: delivery.recipient.nome,
        product: delivery.product,
        motivo: problem.description,
      },
    });
  }
}

export default new CancelationDelivery();
