import React, { useState } from "react";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "./Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error"
import useVisualMode from "hooks/useVisualMode";
import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM"
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment({ time, id, interview, interviewers, onAdd, onSave, onCancel, bookInterview, onDelete, cancelInterview, onConfirm }) {
  const[interviewInfo, setInterview] = useState({})

  const { mode, transition, back } = useVisualMode (
    interview ? SHOW : EMPTY
  );

  function onAdd() {
    transition(CREATE);
  }

  function onCancel() {
    setInterview({});
    back();
  }

  function onSave(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(err => { 
        setInterview(interview); 
        transition(ERROR_SAVE, true)
      }); 
  }

  function onClose() {
    back();
  }

  function onDelete () {
    transition(CONFIRM);
  }

  function onConfirm() {
    transition(DELETING, true);

    cancelInterview(id)
    .then(() => transition(EMPTY))
    .catch(err => transition(ERROR_DELETE, true));
  }
  
  function onEdit() {
    transition(EDIT); 
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={onCancel} onSave={onSave} name={interviewInfo.student} interviewer={interviewInfo.interviewer} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onConfirm={onConfirm} onCancel={onCancel} />}
      {mode === EDIT && <Form interviewers={interviewers} onCancel={onCancel} onSave={onSave} name={interview.student} interviewer={interview.interviewer.id}/>}
      {mode === ERROR_SAVE && <Error onClose={onClose} message="Could not save appointment" />}
      {mode === ERROR_DELETE && <Error onClose={onClose} message="Could not delete appointment" />}
    </article>
  );
}

