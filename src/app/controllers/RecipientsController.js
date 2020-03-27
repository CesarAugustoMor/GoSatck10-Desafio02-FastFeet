import * as Yup from 'yup';
import Recipients from '../models/Recipients';
class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number(),
      complemento: Yup.string(),
      bairro: Yup.string().required(),
      cidade: Yup.string().required(),
      estado: Yup.string().required(),
      cep: Yup.number().required().min(8).max(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação dos dados falhou!' });
    }

    const DestinatarioExiste = await Recipients.findOne({
      where: {
        nome: req.body.nome,
        rua: req.body.rua,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cep: req.body.cep,
      },
    });

    if (DestinatarioExiste) {
      return res.status(400).json({ erro: 'Destinatario já existente.' });
    }

    const {
      id,
      nome,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
    } = await Recipients.create(req.body);

    return res.json({
      id,
      nome,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
    });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      nome: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      bairro: Yup.string(),
      cidade: Yup.string(),
      estado: Yup.string(),
      cep: Yup.number().min(8).max(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validação do dados falhou!' });
    }

    const destinatario = await Recipients.findByPk(req.body.id);

    if (!destinatario) {
      return res.status(400).json({ erro: 'Destinatario não encontrado!' });
    }

    return res.json(await destinatario.update(req.body));
  }
}

export default new RecipientsController();
