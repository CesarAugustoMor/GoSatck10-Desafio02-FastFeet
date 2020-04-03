import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    return res.json(await File.create({ nome: name, path }));
  }
}

export default new FileController();
