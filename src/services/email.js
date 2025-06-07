import { emails } from "../data/emails.js";

export const getEmails = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(emails);
    }, 1500);
  });
};
