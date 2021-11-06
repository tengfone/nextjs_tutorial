import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://tengfone:Whatever1!@cluster0.gseq4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
  return client;
}
