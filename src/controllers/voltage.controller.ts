import express, { Express } from "express";
import Transformer from "../libs/middleware/Transformer.middleware";
import { VoltageService } from "../domain/voltage.service";

// setup express
const app: Express = express();

// Init the service class
const _voltageService = new VoltageService();

/**
 * @description Fetch a list of voltage readings from the database by date range
 */
app.get("/data", (req, res) => {
  if (!req.query.from || !req.query.to)
    return res.status(400).send("Invalid query params");

  const from = req.query.from as string;
  const to = req.query.to as string;

  const result = _voltageService.getVoltageByDateRange(from, to);
  res.send(result);
});

/**
 * @description Add a voltage readings to the database
 */
app.post("/data", Transformer, (req, res) => {
  const { body } = req;
  const result = _voltageService.addVoltageReadings(body);
  res.send(result);
});

export default app;
