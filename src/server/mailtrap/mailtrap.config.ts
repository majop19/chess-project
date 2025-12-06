import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

export const sender = {
  email: "majopart.business@gmail.com",
  name: "MajopArt",
};
