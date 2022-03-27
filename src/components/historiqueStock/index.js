import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const qs = require('qs');
let HistoriqueStock =({role,env,connect})=>{
    let navigate = useNavigate();
   const [historiqueData , setHistoriqueData] = useState([]);
   const [historiqueDataList , setHistoriqueDataList] = useState([]);
   let baseUrlProd = "http://3.145.43.146:9001"
   let baseUrlLocal = "http://localhost:9001"
   let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
   let getHistoriqueData =()=>{
    axios.get(`${baseUrlToUse}/historique/list`).then((response)=>{
        
        setHistoriqueData(response.data);
        let arrayMet=[];
        let newArray = (response.data).filter((element)=>{
           
            let test = arrayMet.filter(check=>check==element.article).length
         
            if(test==0){
                arrayMet.push(element.article)
                
                return element
            }
        })
        setHistoriqueDataList([...newArray]);
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
const [formSearch, setFormSearch] = useState({article:''});
    let handleSubmitSearch =(event)=>{
        event.preventDefault()
        if(formSearch.article.length==0){
            return getHistoriqueData()
        }
        let data = qs.stringify({article:formSearch.article})
        axios.post(`${baseUrlToUse}/historiquestock/search`,data).then((response)=>{
            setHistoriqueData([...response.data])
        })
    }
    let handleChangeSearch = (event)=>{
        let {name,value} = event.target
        setFormSearch({...formSearch,[name]:value});
    }
    return(
        
        <>
            <>
                <form onSubmit={handleSubmitSearch}>
                    <div className="form-group">
                    <label htmlFor="titre">Rechercher un produit </label>
                    <input type="text" onChange={handleChangeSearch} value={formSearch.article} className="form-control" id="article" name="article" list="productList"/>
                    <datalist id="productList">
                        {
                            historiqueDataList.map((historique,index)=>{
                            return  <option key={index} value={historique.article}>{historique.article}</option>
                            })
                        }
                    </datalist>
                    </div>
                    <button type="submit" className="mt-3 mb-3 btn btn-primary">Rechercher</button>
                </form>
            </>
        
            <div className=" table-responsive width-tab-responsive" >
                <table className="table text-center ">
                    <thead className=" bg-warning">
                        <tr>
                            <th className="borderTh">
                            Reference commande
                            </th>
                            <th className="borderTh">
                            Article
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
                                {data.article}
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