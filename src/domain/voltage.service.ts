import { BooleanResponse } from "../libs/types/BooleanResponse.type";
import { Reading } from "../libs/types/Reading.type";
import { v4 as uuid } from "uuid";
import toDateHelper from "../libs/helpers/toDate.helper";
// Database functions
import { addReading, getAllReadings } from "../database";

export class VoltageService {
  private getAllReadings;
  private addReading;

  constructor() {
    this.getAllReadings = getAllReadings;
    this.addReading = addReading;
  }

  /**
   * @description Fetch a list of voltage readings from the database by date range
   * @param {Date} from
   * @param {Date} to
   */
  getVoltageByDateRange(from: string | Date, to: string | Date): Reading[] {
    try {
      from = toDateHelper(from);
      to = toDateHelper(to);
      // If the from date is after the to date, early exit with an error
      if (from > to) throw new Error("From date must be before to date");

      // fetch a list of readings, filtered by the date range
      const readings = this.getAllReadings().filter((row) => {
        const rowDate = toDateHelper(row.time);
        return rowDate >= from && rowDate <= to;
      });

      return readings;
    } catch (error) {
      console.error("Error in getVoltage: ", error);
      throw error;
    }
  }

  /**
   * @description Add a voltage reading to the database
   * @param {Reading} reading
   */
  addVoltageReadings(reading: Reading[]): BooleanResponse {
    try {
      // If the reading is invalid, early exit with an error
      if (reading && !reading?.length) throw new Error("Invalid reading");

      // Add the reading to the database
      reading.forEach((row) => this.addReading(uuid(), row));

      // Return a success message
      return { success: true };
    } catch (error) {
      console.error("Error in addVoltage: ", error);
      throw error;
    }
  }
}
