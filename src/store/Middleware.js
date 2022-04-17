import {
  FIRST_TYPE,LOGIN_TYPE,SIGNUP_TYPE,updateErrorMessage,connect,env,ipProd
} from '../store/reducer/appReducer';
const axios = require('axios');
const qs = require('qs');
let base_url="http://localhost:9001"

    let baseUrlProd = `http://${ipProd}:9001`
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
const Middleware = (store) => (next) => (action) => {
  next(action);
  switch (action.type) {
    case FIRST_TYPE: {
     
      break;
    }
    case LOGIN_TYPE: {
      let data =qs.stringify({
        username:action.data.login,
        password:action.data.password
      })
     
      axios.post(`${baseUrlToUse}/signin`,data).then(response=>{
        
        console.log(response)
        if(response.data.status==="200"){
          const user = JSON.stringify({...response.data})
          localStorage.setItem("user",JSON.stringify(user))
          store.dispatch(connect(response.data))
        }else{
          store.dispatch(updateErrorMessage(response.data))
        }     
      }).catch((error)=>{
        console.log(error)
      }).finally(()=>{
      })
    
      break;
    }
    case SIGNUP_TYPE: {
      let data =qs.stringify({
        username:action.data.login,
        email:action.data.email,
        role:action.data.role,
        password:action.data.password
      })
      axios.post(`${baseUrlToUse}/signup`,data).then(response=>{
        console.log(response)
        store.dispatch(updateErrorMessage(response.data))
        
      })
      break;
    }
    default:
      //next(action);
  }
};

export default Middleware;