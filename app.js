const express = require('express'); // importando o express
const app = express();
const morgan = require('morgan'); // importando o morgan
const bodyParser = require('body-parser'); // importando o body-parser
const cors = require('cors'); // importando o cors

app.use(morgan('dev')); // configurando o morgan
app.use(cors()); // configurando o cors
app.use(bodyParser.urlencoded({ extended: false })); // configurando o body-parser
app.use(bodyParser.json()); // configurando o body-parser

const roupa = require('./rotas/contatoDao');
app.use('/roupa', roupa);

// rota para testar se a api está funcionando
// http://localhost:3000/
app.get('/', (req, res, next) => {
  res.status(200).send({
    resposta: 'api rest funcionando'
  });
});

// passou por todas as rotas e não encontrou a rota solicitada
app.use((req, res, next) => {
  const erro = new Error('Rota nao encontrada');
  erro.status = 404;
  next(erro);
});

// tratamento de erros: responde sempre em JSON
app.use((erro, req, res, next) => {
  res.status(erro.status || 500).send({
    erro: erro.message
  });
});

// exportar o obj app - trata requisições
module.exports = app;