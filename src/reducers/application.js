const lookup = {
  setDay: (state, value) => {
    return { ...state, day: value }
  },
  setApplicationData: (state, value) => { 
    return { ...state, ...value }
  },
  setInterview: (state, value) => {
    return { ...state, ...value }
  },  
}

export default function reducer (state, action) {
  if (lookup[action.type]) return lookup[action.type](state, action.value);
  throw new Error(`Tried to reduce with unsupported action type`);
  };
  
  