const Essencia = require('./essencia.model');

const essenciaController = {
    // Criar essência
     async criar(req, res) {
        try {
            const { nome, ativo } = req.body;

            // Validações
            if (!nome || !ativo) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome e ativo são obrigatórios'
                });
            }

            // if (!['ativo', 'inativo'].includes(tipo)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Tipo deve ser "ativo" ou "inativo"'
            //     });
            // }

            const essencia = await Essencia.create({ nome, ativo });
            
            res.status(201).json({
                success: true,
                message: 'Essência cadastrada com sucesso',
                data: essencia
            });
        } catch (error) {
            console.error('Erro ao criar essência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao criar essência'
            });
        }
    },

    // Listar todas
    async listar(req, res) {
        try {
            const essencias = await Essencia.findAll();
            
            res.json({
                success: true,
                data: essencias
            });
        } catch (error) {
            console.error('Erro ao listar essências:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao listar essências'
            });
        }
    },

    // Buscar por ID
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const essencia = await Essencia.findById(id);
            
            if (!essencia) {
                return res.status(404).json({
                    success: false,
                    message: 'Essência não encontrada'
                });
            }
            
            res.json({
                success: true,
                data: essencia
            });
        } catch (error) {
            console.error('Erro ao buscar essência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar essência'
            });
        }
    },

    // Atualizar
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, ativo } = req.body;

            // Validações
            if (!nome || !ativo) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome e ativo são obrigatórios'
                });
            }

            // if (!['ativo', 'inativo'].includes(tipo)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Tipo deve ser "ativo" ou "inativo"'
            //     });
            // }

            const essencia = await Essencia.update(id, { nome, ativo });
            
            if (!essencia) {
                return res.status(404).json({
                    success: false,
                    message: 'Essência não encontrada'
                });
            }
            
            res.json({
                success: true,
                message: 'Essência atualizada com sucesso',
                data: essencia
            });
        } catch (error) {
            console.error('Erro ao atualizar essência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar essência'
            });
        }
    },

    // Deletar
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const result = await Essencia.delete(id);
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Essência não encontrada'
                });
            }
            
            res.json({
                success: true,
                message: 'Essência deletada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar essência:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao deletar essência'
            });
        }
    }
}

module.exports = essenciaController;