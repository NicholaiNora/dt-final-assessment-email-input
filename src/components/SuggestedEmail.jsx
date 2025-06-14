import React from "react";
import styles from "./Email.module.css";

const SuggestedEmail = ({ suggestedEmails, handleClickedSuggestedEmail }) => {
  return (
    <>
      {suggestedEmails.length > 0 && (
        <ul className={styles.dropdown}>
          {suggestedEmails.map((email, index) => (
            <li key={index} onClick={() => handleClickedSuggestedEmail(email)}>
              {email}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SuggestedEmail;
