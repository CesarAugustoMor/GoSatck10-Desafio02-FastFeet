import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { id, nome, url } = await File.create({ nome: name, path });

    return res.json({ id, nome, path, url });
  }
}

export default new FileController();
