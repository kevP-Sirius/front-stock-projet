import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let HistoriqueStock =({role,env,connect})=>{
    let navigate = useNavigate();
   const [historiqueData , setHistoriqueData] = useState([]);
   let baseUrlProd = "http://3.145.43.146:9001"
   let baseUrlLocal = "http://localhost:9001"
   let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
   let getHistoriqueData =()=>{
    axios.get(`${baseUrlToUse}/historique/list`).then((response)=>{
        
        setHistoriqueData(response.data);
        
    })
   }
   useEffect(()=>{
    getHistoriqueData()
   },[])
   useEffect(()=>{
    if(localStorage.getItem("user")!==null){
        const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
       
        connect(userInfo)
    }else{
        if(role!=="admin"){
            navigate('/')
        }
    }
    
},[role])
    return(
        <>
            <div className=" table-responsive width-tab-responsive" >
                <table className="table text-center ">
                    <thead className=" bg-warning">
                        <tr>
                            <th className="borderTh">
                            Reference commande
                            </th>
                            <th className="borderTh">
                            Utilisateur
                            </th>
                            <th className="borderTh">
                            Role
                            </th>
                            <th className="borderTh">
                            Action effectuée
                            </th>
                            <th className="borderTh">
                            Quantité associée
                            </th>
                            <th className="borderTh">
                            Etat précédent
                            </th>
                            <th className="borderTh">
                            Etat suivant
                            </th>
                            <th className="borderTh">
                            Date de modification
                            </th>
                            
                            
                        </tr>    
                    </thead>
                    <tbody>  
                        {historiqueData.map((data,key)=>{
                          return (
                            <tr className="text-white bg-info" key={key}>
                                <td>
                                {data.command_ref}
                                </td>
                                <td>
                                {data.username}
                                </td>
                                <td>
                                {data.role}
                                </td>
                                <td>
                                {data.action}
                                </td>
                                <td>
                                {data.action_qte}
                                </td>
                                <td>
                                {data.previous_state}
                                </td>
                                <td>
                                {data.next_state}
                                </td>
                                <td>
                                {data.date_modification}
                                </td>
                            </tr>
                          )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default HistoriqueStock;