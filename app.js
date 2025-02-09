// Corrigir problema de CORS no servidor
import axios from 'axios';
import express from 'express';
import cors from 'cors';

const app = express();

// Configura��o do CORS para permitir qualquer dom�nio
app.use(cors({
  origin: '*', // Permite requisi��es de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // M�todos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabe�alhos permitidos
}));

app.use(express.json());

// Rota para gerar PIX
app.post('/g', async (req, res) => {
  try {
    const { name, cpf, offerId, email, phone, utmQuery } = req.body;

    if (!name || !cpf || !offerId || !email || !phone) {
      return res.status(400).json({ error: 'Todos os campos obrigat�rios devem ser preenchidos: name, cpf, offerId, email, phone.' });
    }

    const response = await axios.post('https://app.exattus.com/api/webhook/generate-pix/', {
      name,
      cpf,
      offerId,
      email,
      phone,
      utmQuery
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao gerar PIX:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data || 'Erro da API Exattus',
      });
    }
    return res.status(500).json({ error: 'Erro interno ao processar o PIX' });
  }
});

// Rota para verificar pagamento
app.post('/verify', async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'O campo paymentId � obrigat�rio.' });
    }

    const response = await axios.post('https://app.exattus.com/api/verify-payment', {
      paymentId,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data || 'Erro da API Exattus',
      });
    }
    return res.status(500).json({ error: 'Erro interno ao verificar o pagamento' });
  }
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});