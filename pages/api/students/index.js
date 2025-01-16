import { db } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM students");
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: "Database error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
