const { sendEmailWithResolution } = require("./sendEmailWithResolution");
const { TICKET } = require("./ticket.model");

const newTicket = async (req, res) => {
  const { ticketId, name, contactNumber, email, category, query } = req.body;
  try {
    if ((!ticketId || !name, !contactNumber || !email, !category, !query)) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newTicket = new TICKET({
      ticketId,
      name,
      contactNumber,
      email,
      category,
      query,
    });
    await newTicket.save();
    return res.status(200).json({ message: "Ticket saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const newTicketId = async (req, res) => {
  try {
    const ticketCount = (await TICKET.countDocuments()) + 1;
    let paddedCount = ticketCount.toString().padStart(2, "0");
    let ticketId = "TC" + paddedCount;
    return res.status(200).json({ ticketId });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const allTickets = async (req, res) => {
  try {
    const tickets = await TICKET.find().sort({_id: -1});
    return res.status(200).json({ data: tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const updateTickets = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTicket = await TICKET.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTicket)
      return res.status(404).json({ msg: "Ticket not found" });
    if(updatedTicket.status==="closed"){
      sendEmailWithResolution(updatedTicket)
    }
    return res
      .status(200)
      .json({ message: "Ticket updated successfully", updatedTicket });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

module.exports = { newTicket, newTicketId, allTickets, updateTickets };
