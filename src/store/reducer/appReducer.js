// == Initial State
const initialState = {
    firststate:'',
    username:'',
    role:'',
    isConnected:false,
    messageError:'',
    messageStatus:'',
    ipProd:'3.16.81.126',
    env:'prod'

  };
  
  // == Types
  export const FIRST_TYPE = 'FIRST_TYPE';
  export const LOGIN_TYPE = 'LOGIN_TYPE';
  export const SIGNUP_TYPE = 'SIGNUP_TYPE';
  export const ERROR_MSG_TYPE = 'ERROR_MSG_TYPE';
  export const CONNECT = 'CONNECT';
  export const DISCONNECT = 'DISCONNECT';
  // == Reducer
  export const appReducer = (state = initialState, action = {}) => {
    
    switch (action.type) {
      case FIRST_TYPE:
        return  {
          ...state,
          firststate:action.data
        };
      case LOGIN_TYPE:
        return  {
          ...state,
         
        };
      case SIGNUP_TYPE:
        return  {
          ...state,
        };
      case CONNECT:
          return  {
            ...state,
            isConnected:true,
            role:action.data.role,
            username:action.data.username,
            messageStatus:action.data.status
          };
      case DISCONNECT:
          return  {
            ...state,
            isConnected:false,
            role:'',
            username:'',
            messageStatus:''
          };
      case ERROR_MSG_TYPE:
      return  {
        ...state,
        messageError:action.data.message,
        messageStatus:action.data.status
      };
      default:
        return state;
    }
    
  };
  
  // == Action Creators
  export const firstAction = (data) => (
    {
    type: FIRST_TYPE,
    data
  });
  // == Action Creators
  export const login = (data) => (
    {
    type: LOGIN_TYPE,
    data
  });
  export const signup = (data) => (
    {
    type: SIGNUP_TYPE,
    data
  });
  export const updateErrorMessage = (data) => (
    {
    type: ERROR_MSG_TYPE,
    data
  });
  export const connect = (data) => (
    {
    type: CONNECT,
    data
  });
  export const disconnect = () => (
    {
    type: DISCONNECT,
  });
  
  


  
  
  // == Export

  export const env = initialState.env;
  export const ipProd = initialState.ipProd;
  