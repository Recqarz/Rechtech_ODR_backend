const { allClient, updateClient } = require("../controllers/client.controller");

const clientRoute = require("express").Router();

clientRoute.get("/all", allClient);

clientRoute.put("/update/:id", updateClient);

module.exports = { clientRoute };
