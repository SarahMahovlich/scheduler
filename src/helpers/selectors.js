export function getAppointmentsForDay(state, day) {
  const filterDay = state.days.filter(item => item.name === day);

  if(filterDay.length === 0) {
    return filterDay;
  }
  
  const filteredAppts = filterDay[0].appointments.map(currentId => state.appointments[currentId]);
  return filteredAppts;

  }

export function getInterview(state, interview) {

  if(interview) {
    const index = interview.interviewer;
    return { ...interview, interviewer: state.interviewers[index] };
  } 

  return null;
  
  }

  export function getInterviewersForDay(state, day) {
  
    const filterDay = state.days.filter(item => item.name === day);
  
    if(filterDay.length === 0) {
      return filterDay;
    }
    
    const filteredInterviewers = filterDay[0].interviewers.map(currentId => state.interviewers[currentId]);
    return filteredInterviewers;
  
    }
