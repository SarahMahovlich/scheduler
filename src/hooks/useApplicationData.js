import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer from "reducers/application";

export function useApplicationData() {

  const initialStateInfo = {
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: {}
  }
  
  const [state, dispatchStateInfo] = useReducer(
    reducer, 
    initialStateInfo
  );

  const setDay = day => dispatchStateInfo({type: "setDay", value: day}); /*setState({ ...state, day });*/

  function bookInterview(id, interview) {
   
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const getSpotsForDay = day =>
    day.appointments.length -
    day.appointments.reduce(
      (count, id) => (appointments[id].interview ? count + 1 : count),
      0
    );

    const days = state.days.map(day => {
      return day.appointments.includes(id)
        ? {
            ...day,
            spots: getSpotsForDay(day)
          }
        : day;
    });

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => dispatchStateInfo({type: "setInterview", value: { appointments, days }}))
    .catch(err => {console.log(err); throw err});
  }

  function cancelInterview(id) {
    
    const appointment = {
      ...state.appointments[id], 
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const getSpotsForDay = day =>
    day.appointments.length -
    day.appointments.reduce(
      (count, id) => (appointments[id].interview ? count + 1 : count),
      0
    );

  const days = state.days.map(day => {
    return day.appointments.includes(id)
      ? {
          ...day,
          spots: getSpotsForDay(day)
        }
      : day;
  });

    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatchStateInfo({type: "setInterview", value: { appointments, days }}))
    .catch(err => { console.log(err); throw err});
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`/api/days`)),
      Promise.resolve(axios.get(`/api/appointments`)),
      Promise.resolve(axios.get(`/api/interviewers`))
    ]).then((all) => {
      dispatchStateInfo({type: "setApplicationData", value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
    })
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}
