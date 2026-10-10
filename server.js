const http = require('http'); // criando o http
const app = require('./app'); // incluindo o projeto em app.js
const port = process.env.PORT || 3000; // configurando a porta
const server = http.createServer(app); // criando servidor
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);//mensagem que verifica se subiu 
});