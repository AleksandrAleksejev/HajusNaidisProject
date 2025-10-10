const express = require("express");
const app = express();
const port = 8080;

const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load("./docs/swagger.yaml");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // на всякий случай

let games = [
    { id: 1, name: "Witcher 3", price: 29.99 },
    { id: 2, name: "Cyberpunk 2077", price: 59.99 },
    { id: 3, name: "Minecraft", price: 26.99 },
    { id: 4, name: "CS-GO", price: 0 },
    { id: 5, name: "Roblox", price: 0 },
    { id: 6, name: "Valorant", price: 29.99 },
    { id: 7, name: "GTA5", price: 0 },
    { id: 8, name: "Forza Horizon 5", price: 59.99 }
];

// GET all games
app.get("/games", (req, res) => res.json(games));

// GET game by ID
app.get("/games/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });
    const game = games.find(g => g.id === id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
});

// POST add new game
app.post("/games", (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: "Missing name or price" });

    const id = games.length ? Math.max(...games.map(g => g.id)) + 1 : 1;
    const game = { id, name, price };
    games.push(game);
    res.status(201).json(game);
});

// DELETE game by ID
app.delete("/games/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    const index = games.findIndex(g => g.id === id);
    if (index === -1) return res.status(404).json({ error: "Game not found" });

    games.splice(index, 1);
    res.status(204).send();
});

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(port, () => {
    console.log(`API running: http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/docs`);
});
