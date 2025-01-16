import { db } from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, mobilenumber, address } = req.body;

    if (!name || !mobilenumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      await db.query(
        "UPDATE students SET name = ?, mobilenumber = ?, address = ? WHERE id = ?",
        [name, mobilenumber, address, id]
      );

      res.status(200).json({ id, name, mobilenumber, address });
    } catch (error) {
      res.status(500).json({ message: "Database error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
  
  if (req.method === "DELETE") {
    try {
      await db.query("DELETE FROM students WHERE id = ?", [id]);
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
