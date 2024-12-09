const { newTicket, newTicketId, allTickets, updateTickets } = require("./ticket.controller");

const ticketRouter = require("express").Router();

ticketRouter.post("/new-ticket", newTicket);
ticketRouter.get("/new-ticketId", newTicketId);
ticketRouter.get("/all-tickets", allTickets);
ticketRouter.put("/update-tickets/:id", updateTickets);

module.exports = { ticketRouter };
