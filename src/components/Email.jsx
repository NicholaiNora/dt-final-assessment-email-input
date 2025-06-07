import React, { useEffect, useState } from "react";
import { getEmails } from "../services/email.js";
import styles from "./Email.module.css";

const Email = () => {
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);
  const [suggestedEmails, setSuggestedEmails] = useState([]);
  const [enteredEmails, setEnteredEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const data = await getEmails();
      setEmails(data);
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestedEmails([]);
    } else {
      const filteredEmails = emails.filter((email) =>
        email.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestedEmails(filteredEmails);
    }
  }, [query, emails]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClickedSuggestedEmail = (email) => {
    addEmail(email);
    setQuery("");
    setSuggestedEmails([]); // hide suggestedEmails after selection
  };

  const addEmail = (email) => {
    const emailExists = emails.includes(email);
    setEnteredEmails((prev) => [
      ...prev,
      { value: email.toLowerCase(), valid: emailExists },
    ]);
  };

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      if (query.trim() !== "") {
        addEmail(query.trim());
        setQuery("");
      }
    } else if (
      e.key === "Backspace" &&
      query === "" &&
      enteredEmails.length > 0
    ) {
      setEnteredEmails((prev) => prev.slice(0, -1));
    }
  };

  const removeEmail = (index) => {
    setEnteredEmails((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.wrapper}
        onClick={() => document.getElementById("email-input").focus()}
      >
        {enteredEmails.map((email, index) => (
          <li
            key={index}
            className={`${styles.text} ${
              email.valid ? styles.valid : styles.invalid
            }`}
          >
            {email.value}
            <span
              className={styles.removeBtn}
              onClick={() => removeEmail(index)}
            >
              ×
            </span>
          </li>
        ))}
        <input
          id="email-input"
          className={styles.input}
          type="text"
          placeholder="Enter recipients…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      {suggestedEmails.length > 0 && (
        <ul
          style={{
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            marginTop: "0",
            padding: "5px 0",
            maxHeight: "150px",
            overflowY: "auto",
            position: "absolute",
            zIndex: 1000,
            width: "400px",
          }}
        >
          {suggestedEmails.map((email, index) => (
            <li
              key={index}
              onClick={() => handleClickedSuggestedEmail(email)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Email;
