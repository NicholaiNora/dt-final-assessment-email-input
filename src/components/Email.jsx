import React, { useEffect, useState } from "react";
import { getEmails } from "../services/email.js";
import styles from "./Email.module.css";
import EnteredEmail from "./EnteredEmail.jsx";
import SuggestedEmail from "./SuggestedEmail.jsx";

const Email = () => {
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedEmails, setSuggestedEmails] = useState([]);
  const [enteredEmails, setEnteredEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      const data = await getEmails();
      setEmails(data);
      setLoading(false);
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);

      if (query.trim() === "") {
        setSuggestedEmails([]);
        setLoading(false);
        return;
      }

      const alreadyEntered = enteredEmails
        .map((email) => email.value.toLowerCase());

      await new Promise((r) => setTimeout(r, 1000));

      const filtered = emails
        .filter(
          (email) =>
            email.toLowerCase().includes(query.toLowerCase()) &&
            !alreadyEntered.includes(email.toLowerCase())
        )
        .sort((a, b) => {
          const startsWithA = a.toLowerCase().startsWith(query.toLowerCase());
          const startsWithB = b.toLowerCase().startsWith(query.toLowerCase());
          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;
          return a.localeCompare(b);
        });

      setSuggestedEmails(filtered);
      setLoading(false);
    };

    fetchSuggestions();
  }, [query, emails, enteredEmails]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClickedSuggestedEmail = (email) => {
    addEmail(email);
    setQuery("");
    setSuggestedEmails([]);
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
        <EnteredEmail enteredEmails={enteredEmails} removeEmail={removeEmail} />
        <input
          id="email-input"
          className={styles.input}
          type="text"
          placeholder={enteredEmails.length === 0 ? "Enter recipients…" : ""}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {loading && <div className={styles.loader}></div>}
      </div>
      <SuggestedEmail
        suggestedEmails={suggestedEmails}
        handleClickedSuggestedEmail={handleClickedSuggestedEmail}
      />
    </div>
  );
};

export default Email;
