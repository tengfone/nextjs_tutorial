import { hashPassword } from "../../../helper/auth";
import { connectToDatabase } from "../../../helper/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { email, password } = data;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message: "Invalid Input",
      });
      return;
    }
    const client = await connectToDatabase();
    const db = client.db();

    // Check if user exist
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      res.status(422).json({ message: "User Exists Already" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);
    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created" });
    client.close();
  }
}
