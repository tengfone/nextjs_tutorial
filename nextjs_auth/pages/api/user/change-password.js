import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../helper/db";
import { verifyPassword, hashPassword } from "../../../helper/password";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }
  // Check if auth user or not
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({
      message: "Auth Missing",
    });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");

  const user = await userCollection.findOne({
    email: userEmail,
  });

  if (!user) {
    res.status(404).json({
      message: "User No Found",
    });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordAreEqual) {
    res.status(403).json({
      message: "Wrong Auth (Invalid Password)",
    });
    client.close();
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);

  const result = await userCollection.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  );

  client.close();
  res.status(200).json({
    message: "Password Updated",
  });
}
