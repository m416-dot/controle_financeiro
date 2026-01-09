const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ROTA TESTE
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// LISTAR
app.get("/movimentacoes", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM movimentacoes ORDER BY data DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// INSERIR
app.post("/movimentacoes", async (req, res) => {
    const { tipo, data, valor, descricao } = req.body;

    if (!tipo || !data || !valor) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO movimentacoes (tipo, data, valor, descricao)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [tipo, data, valor, descricao]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Servidor rodando 🚀");
});
