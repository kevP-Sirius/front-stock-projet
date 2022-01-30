import { Routes,Route } from "react-router-dom"
import { useEffect } from 'react';
import SigninContainer from "./container/signinContainer";
import SignupContainer from "./container/signupContainer";
import HomepageContainer from "./container/homepageContainer";
import ProductsContainer from "./container/productsContainer";
import UsersContainer from "./container/usersContainer";
import ClientsContainer from "./container/clientsContainer";
import OperationsContainer from "./container/operationContainer";
import CartsContainer from "./container/cartContainer";
const App = ({firststate,firstAction,role,connect}) => {

  
  useEffect(()=>{
    if(localStorage.getItem("user")!==null){
      const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
      console.log(userInfo) 
      connect(userInfo)
    }
  },[])

  return (
    <>
    <div className="container  p-3">
        <div className="row">
            <Routes>
                <Route path="/" element={<HomepageContainer />} />
                <Route path="/signin" element={<SigninContainer />} />
                <Route path="/signup" element={<SignupContainer />} />
                <Route path="/products" element={<ProductsContainer />} />
                <Route path="/clients" element={<ClientsContainer />} />
                <Route path="/operations" element={<OperationsContainer />} />
                <Route path="/command" element={<CartsContainer />} />
                <Route path="/users" element={<UsersContainer />} />
            </Routes>
        </div>
    </div>
    </>
  )
}

export default App;
