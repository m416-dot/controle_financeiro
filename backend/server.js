console.log("Servidor iniciando...");

const { Pool } = require("pg");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS movimentacoes (
    id SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL,
    data DATE NOT NULL,
    valor NUMERIC NOT NULL,
    descricao TEXT
  )
`).then(() => {
  console.log("Tabela movimentacoes pronta");
}).catch(err => {
  console.error("Erro ao criar tabela:", err);
});


app.use(express.json());

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        data TEXT NOT NULL,
        valor REAL NOT NULL,
        descricao TEXT
    )
`);

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/movimentacoes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM movimentacoes ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/movimentacoes", async (req, res) => {
  const { tipo, valor, data, descricao } = req.body;

  if (!tipo || !valor || !data) {
    return res.status(400).json({ error: "Dados obrigatórios faltando." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO movimentacoes (tipo, valor, data, descricao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tipo, valor, data, descricao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
