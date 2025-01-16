import { db } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, mobilenumber, address } = req.body;

    if (!name || !mobilenumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const [result] = await db.query(
        "INSERT INTO students (name, mobilenumber, address) VALUES (?, ?, ?)",
        [name, mobilenumber, address]
      );

      res.status(201).json({ id: result.insertId, name, mobilenumber, address });
    } catch (error) {
      res.status(500).json({ message: "Database error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
