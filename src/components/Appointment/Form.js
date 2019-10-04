import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";

export default function Form({ name:initialName, interviewer:initialInterviewer, interviewers, onSave, onCancel }) {
  const [name, setName] = useState(initialName || "");
  const [interviewer, setInterviewer] = useState(initialInterviewer || null);

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    onCancel();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
      <form autoComplete="off" onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </form>
    <InterviewerList interviewers={interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button onClick={cancel} danger>Cancel</Button>
        <Button onClick={() => onSave(name, interviewer)} confirm>Save</Button>
      </section>
    </section>
  </main>
  );

}



