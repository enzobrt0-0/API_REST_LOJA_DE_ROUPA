const express = require('express');
const router = express.Router();
const mysql = require('./mysql').pool;

// GET http://localhost:3000/roupa
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error, response: null });
    }

    conn.query('SELECT * FROM roupa;', (error, resultado, fields) => {
      conn.release();

      if (error) {
        return res.status(500).send({ error: error, response: null });
      }

      return res.status(200).send({ response: resultado });
    });
  });
});

// GET http://localhost:3000/roupa/1
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error, response: null });
    }

    conn.query('SELECT * FROM roupa WHERE id = ?;', [id], (error, resultado, fields) => {
      conn.release();

      if (error) {
        return res.status(500).send({ error: error, response: null });
      }

      if (resultado.length === 0) {
        return res.status(404).send({ error: 'Roupa nao encontrada', response: null });
      }

      return res.status(200).send({ response: resultado[0] });
    });
  });
});

// POST http://localhost:3000/roupa
router.post('/', (req, res, next) => {
  const { descricao, tamanho, preco } = req.body;

  if (!descricao || !tamanho || preco === undefined) {
    return res.status(400).send({
      error: 'Informe descricao, tamanho e preco',
      response: null
    });
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error, response: null });
    }

    conn.query(
      'INSERT INTO roupa (descricao, tamanho, preco) VALUES (?,?,?);',
      [descricao, tamanho, preco],
      (error, resultado, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error, response: null });
        }

        return res.status(201).send({
          response: 'roupa cadastrada',
          'ID-ROUPA-CADASTRADA': resultado.insertId
        });
      }
    );
  });
});

// PUT http://localhost:3000/roupa/1
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { descricao, tamanho, preco } = req.body;

  if (!descricao || !tamanho || preco === undefined) {
    return res.status(400).send({
      error: 'Informe descricao, tamanho e preco',
      response: null
    });
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error, response: null });
    }

    conn.query(
      'UPDATE roupa SET descricao = ?, tamanho = ?, preco = ? WHERE id = ?;',
      [descricao, tamanho, preco, id],
      (error, resultado, fields) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error, response: null });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).send({ error: 'Roupa nao encontrada', response: null });
        }

        return res.status(200).send({
          response: 'roupa atualizada',
          'ROUPAS-ATUALIZADAS': resultado.affectedRows
        });
      }
    );
  });
});

// DELETE http://localhost:3000/roupa/1
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error, response: null });
    }

    conn.query('DELETE FROM roupa WHERE id = ?;', [id], (error, resultado, fields) => {
      conn.release();

      if (error) {
        return res.status(500).send({ error: error, response: null });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).send({ error: 'Roupa nao encontrada', response: null });
      }

      return res.status(200).send({
        response: 'roupa deletada',
        'REGISTROS-REMOVIDOS': resultado.affectedRows
      });
    });
  });
});

module.exports = router;