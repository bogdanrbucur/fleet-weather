const express = require("express");
const router = express.Router();
const { getShips } = require("../mongodb");
const debug = require("debug")("app:route");
const { parseIP } = require("../parse"); // Import parseIP function from parse module

let ships; // Declared top level so it can be accessed anywhere in the module

router.get("/", (req, res) => {
  // Get remote client IP
  let ip = parseIP(req.ip);
  debug(`Remote client ${ip} connected.`);

  // Get ships from MongoDB. Must wrap in an anonymous async in order to use await
  (async () => {
    ships = await getShips();
    debug("Sent", ships);
  })();

  res.render("index", {
    // use to render HTML using a template engine like pug
    title: "Fleet Weather", // used in Pug
    ships: ships, // used to send data in Pug
  });
});

router.get("/api/getships", (req, res) => {
  // Get remote client IP
  let ip = parseIP(req.ip);
  debug(`Remote client ${ip} requested update.`);

  // Get ships from MongoDB. Must wrap in an anonymous async in order to use await
  (async () => {
    ships = await getShips();
    debug("Sent", ships);
  })();

  res.status(200).send(ships); // send the ships array to the client
});

module.exports = router;
