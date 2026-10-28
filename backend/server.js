// backend/server.js
const express = require('express');
const { createCoffeeRouter } = require('./src/coffee/coffeeRouter'); // contador de cafés
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON e dados de formulário URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilita CORS (precisa vir ANTES das rotas)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Contador de cafés: GET, POST e DELETE em /api/coffee
app.use('/api/coffee', createCoffeeRouter());

// Rota de saudação (POST)
app.post('/api/saudacao', (req, res) => {
    const { nome } = req.body;

    if (!nome || nome.trim() === '') {
        return res.status(400).json({ erro: 'O nome é obrigatório.' });
    }

    const saudacao = `Salve, ${nome}! Senta ai, e tome um cafézin.`;
    const tempoPreparo = Math.floor(Math.random() * 3) + 1; // 1 a 3 minutos

    res.json({
        mensagem: saudacao,
        tempo: `${tempoPreparo} minuto(s)`
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});