const express = require("express");
const { entry, status, update, markAsAttended} = require("../controllers/filaController");

const router = express.Router();

router.post("/fila", entry);
router.post("/fila/status", status);
router.patch('/fila/attend', markAsAttended);



module.exports = router;    