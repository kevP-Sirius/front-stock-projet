import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let HistoriqueStock =({role,env})=>{
    let navigate = useNavigate();
   const [historiqueData , setHistoriqueData] = useState([]);
   let baseUrlProd = "http://3.145.43.146:9001"
   let baseUrlLocal = "http://localhost:9001"
   let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
   let getHistoriqueData =()=>{
    axios.get(`${baseUrlToUse}/historique/list`).then((response)=>{
        console.log(response.data)
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
                            <tr key={key}>
                                <td>
                                data
                                </td>
                                <td>
                                data
                                </td>
                                <td>
                                data
                                </td>
                                <td>
                                data
                                </td>
                                <td>
                                data
                                </td>

                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default HistoriqueStock;