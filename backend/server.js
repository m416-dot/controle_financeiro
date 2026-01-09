const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   CONEXÃO COM SUPABASE
========================= */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/* =========================
   CRIA TABELA (SE NÃO EXISTIR)
========================= */
pool.query(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
        id SERIAL PRIMARY KEY,
        tipo TEXT NOT NULL,
        data DATE NOT NULL,
        valor NUMERIC NOT NULL,
        descricao TEXT
    );
`)
.then(() => console.log("Tabela 'movimentacoes' pronta"))
.catch(err => console.error("Erro ao criar tabela:", err));

/* =========================
   ROTAS
========================= */

// TESTE DE VIDA
app.get("/", (req, res) => {
    res.send("API Controle Financeiro funcionando 🚀");
});

// LISTAR MOVIMENTAÇÕES
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

// ADICIONAR MOVIMENTAÇÃO
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

// DELETAR MOVIMENTAÇÃO (opcional, mas útil)
app.delete("/movimentacoes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            "DELETE FROM movimentacoes WHERE id = $1",
            [id]
        );
        res.json({ message: "Movimentação removida" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   START DO SERVIDOR
========================= */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
