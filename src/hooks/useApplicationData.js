import { useEffect, useState, useReducer } from "react";
import axios from "axios";

export function useApplicationData() {

  const initialStateInfo = {
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: {}
  }

    // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: [],
  //   interviewers: {}
  // });
  
  const lookup = {
    setDay: (state, value) => {
      return { ...state, day: value }
    },
    setSpots: (state, value) => {
      return { ...state, days: value }
    },
    setApplicationData: (state, value) => { 
      return { ...state, ...value }
    },
    setInterview: (state, value) => {
      return { ...state, appointments: value }
    }
  }
  
  const reduceStateInfo = (state, action) => {
    return lookup[action.type](state, action.value) || state;
  };
  
  const [state, dispatchStateInfo] = useReducer(
    reduceStateInfo, 
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

    const days = state.days; 

    function findDay() {
      for(const item of state.days) {
        if(item.appointments.includes(id)) {
          return item.id;
        }
      }
    }
    console.log(findDay());
    
    const day = state.days[findDay() - 1].spots;

    console.log(day.spots);
    

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      dispatchStateInfo({type: "setInterview", value: appointments});
      // .then(axios.get(`/api/days`))
      // .then((output) => dispatchStateInfo({type: "setApplicationData", value: { days: output} }));
      // dispatchStateInfo({type: "setSpots", value: });

    })

    // .then(() => setState({...state, appointments}));
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

    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatchStateInfo({type: "setInterview", value: appointments}));
    // .then(() => setState({...state, appointments}));
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`/api/days`)),
      Promise.resolve(axios.get(`/api/appointments`)),
      Promise.resolve(axios.get(`/api/interviewers`))
    ]).then((all) => {
      dispatchStateInfo({type: "setApplicationData", value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [state.appointments]);

  return { state, setDay, bookInterview, cancelInterview }

}