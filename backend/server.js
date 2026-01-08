console.log("Servidor iniciando...");

// ============================
// IMPORTA DEPENDÊNCIAS
// ============================
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ============================
// CONFIGURAÇÕES
// ============================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// MIDDLEWARES
// ============================
app.use(express.json());

// ============================
// CAMINHO DO FRONTEND
// ============================
const frontendPath = path.join(__dirname, "../frontend");

// 👉 SERVE ARQUIVOS ESTÁTICOS (script.js, css, etc)
app.use(express.static(frontendPath));

// ============================
// CAMINHO DO BANCO
// ============================
const dbPath = path.resolve(__dirname, "database.db");

// ============================
// BANCO DE DADOS
// ============================
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Banco SQLite conectado com sucesso!");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        data TEXT NOT NULL,
        valor REAL NOT NULL,
        descricao TEXT
    )
`);

// ============================
// ROTAS DO FRONTEND
// ============================
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ============================
// ROTAS DA API
// ============================
app.get("/movimentacoes", (req, res) => {
    db.all("SELECT * FROM movimentacoes", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post("/movimentacoes", (req, res) => {
    const { tipo, valor, data, descricao } = req.body;

    if (!tipo || !valor || !data) {
        return res.status(400).json({ error: "Dados obrigatórios faltando." });
    }

    const sql = `
        INSERT INTO movimentacoes (tipo, valor, data, descricao)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [tipo, valor, data, descricao], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            tipo,
            valor,
            data,
            descricao
        });
    });
});

// ============================
// INICIA SERVIDOR
// ============================
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
