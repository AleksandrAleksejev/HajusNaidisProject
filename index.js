const express = require("express");
const app = express();
const port = 8080;

const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load("./docs/swagger.yaml");

// Позволяет Express читать JSON-тело запросов
app.use(express.json());

const games = [
    { id: 1, name: "Witcher 3", price: 29.99 },
    { id: 2, name: "Cyberpunk 2077", price: 59.99 },
    { id: 3, name: "Minecraft", price: 26.99 },
    { id: 4, name: "CS-GO", price: 0 },
    { id: 5, name: "Roblox", price: 0 },
    { id: 6, name: "Valorant", price: 29.99 },
    { id: 7, name: "GTA5", price: 0 },
    { id: 8, name: "Forza Horizon 5", price: 59.99 }
];

// --- Получить список всех игр ---
app.get("/games", (req, res) => {
    res.json(games);
});

// --- Получить игру по ID ---
app.get("/games/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    const game = games.find(g => g.id === id);

    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
});

// --- Добавить новую игру ---
app.post("/games", (req, res) => {
    if (!req.body.name || req.body.price === undefined) {
        return res.status(400).json({ error: "Missing required fields: name or price" });
    }

    const newGame = {
        id: games.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    games.push(newGame);
    res.status(201).json(newGame); // Возвращаем добавленную игру
});

// --- Swagger документация ---
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Запуск сервера ---
app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/docs`);
});
