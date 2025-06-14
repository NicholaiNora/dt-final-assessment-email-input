import React from "react";
import styles from "./Email.module.css";

const EnteredEmail = ({ enteredEmails, removeEmail }) => {
  return (
    <>
      {enteredEmails.map((email, index) => (
        <li
          key={index}
          className={`${styles.text} ${
            email.valid ? styles.valid : styles.invalid
          }`}
        >
          {email.value}
          <span
            className={email.valid ? styles.removeBtn : styles.removeBtnInvalid}
            onClick={() => removeEmail(index)}
          ></span>
        </li>
      ))}
    </>
  );
};

export default EnteredEmail;
