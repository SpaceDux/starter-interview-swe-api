import { NextFunction, Request, Response } from "express";

export default function Transformer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Transform the request body text into a JSON object
  if (typeof req.body !== "string") return next();
  console.debug("Transformer middleware");

  // split regEx - split on any whitespace, incase there are multiple spaces between values
  const whitespaceRegex = new RegExp(/\s+/);

  const transformedValue = req.body
    ? req.body
        .toString()
        .split("\n")
        .map((row: string) => {
          const [time, name, value] = row.split(whitespaceRegex);
          // Check if the data is malformed, if so return null for a further filter below.
          if (!time || !name || !value) return null;
          if (isNaN(parseInt(time))) return null;
          if (isNaN(parseInt(value))) return null;
          if (!["voltage", "current"].includes(name.toLowerCase())) return null;

          return { name, time: new Date(parseInt(time) * 1000), value };
        })
    : [];

  // Filter out any null values from the transformedValue array
  // If the length of the array is different, then there was an error in the transformation
  if (transformedValue.length !== transformedValue.filter(Boolean).length)
    return res.status(400).send({ success: false });

  req.body = transformedValue;

  next();
}
