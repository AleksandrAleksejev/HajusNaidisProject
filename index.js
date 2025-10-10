const express = require("express");
const app = express();
const port = 8080;

const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load("./docs/swagger.yaml");

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

// --- Получить все игры ---
app.get("/games", (req, res) => {
    res.json(games);
});

// --- Получить игру по ID ---
app.get("/games/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    const game = games.find(g => g.id === id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
});

// --- Добавить новую игру ---
app.post("/games", (req, res) => {
    if (!req.body.name || req.body.price === undefined) {
        return res.status(400).send({ error: "Missing required fields: name or price" });
    }

    const game = {
        id: games.length ? Math.max(...games.map(g => g.id)) + 1 : 1,
        name: req.body.name,
        price: req.body.price
    };

    games.push(game);
    res.status(201)
        .location(`${getBaseUrl(req)}/games/${game.id}`)
        .json(game);
});

// --- Удалить игру по ID ---
app.delete("/games/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    const index = games.findIndex(g => g.id === id);
    if (index === -1) return res.status(404).json({ error: "Game not found" });

    games.splice(index, 1);
    res.status(204).send();
});

// --- Swagger ---
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Функция для получения базового URL ---
function getBaseUrl(req) {
    const protocol = req.connection && req.connection.encrypted ? "https" : "http";
    return `${protocol}://${req.headers.host}`;
}

// --- Запуск сервера ---
app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/docs`);
});
