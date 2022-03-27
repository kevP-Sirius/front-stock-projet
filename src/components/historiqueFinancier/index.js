
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button,Modal} from 'react-bootstrap';
const qs = require('qs');

let HistoriqueFinancier=({role,env,connect})=>{
    let navigate = useNavigate();
    const [historiqueData , setHistoriqueData] = useState([]);
    let [forms,setForm ] = useState({client:''})
    let [clients,setClients] =useState([])
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let getHistoriqueData =()=>{
     axios.get(`${baseUrlToUse}/historiquefinancier/list`).then((response)=>{
         
         setHistoriqueData(response.data);
         
     })
    }
    let getClients=()=>{
        axios.get(`${baseUrlToUse}/clients/list`).then(response=>{
            setClients(response.data)
        })
    }
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    useEffect(()=>{
     getHistoriqueData()
     getClients()
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
 let handleSubmit=(event)=>{
     event.preventDefault();
     let data = qs.stringify({search:forms.client})
     axios.post(`${baseUrlToUse}/historique/search`,data).then((response)=>{
        setHistoriqueData(response.data);
     })
 }
 const [show, setShow] = useState(false);
    const [idToDelete, setIdToDelete] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow =()=> {
      
      setShow(true)
    };
    let handleDeleteAllHistorique =(event)=>{
        const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({userInfo:userInfo})
        axios.post(`${baseUrlToUse}/historiquefinancial/delete/all`,data).then((response)=>{
            getHistoriqueData()
        })
    }
    return(
        <>
         <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Suppréssion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Souhaitez vous confirmer la suppréssion?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={()=>{
             handleDeleteAllHistorique()
              setShow(false);
              }}>
            Confirmer la suppréssion
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
   
            <div className=" table-responsive width-tab-responsive" >
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label htmlFor="titre">Liste client</label>
                        <select type="text" onChange={handleChange} value={forms.client} className="form-control" id="designation" name="client" aria-describedby="client">
                        <option key={0} value="">Selectionnez un client</option>
                        {clients.map((client,index)=>{
                            return <option key={index+1} value={client._id}>{client.firstname} , {client.lastname} , {client.company}</option>
                        })}
                        </select>
                        </div>
                        <button type="submit" className="mt-3 mb-3 btn btn-primary">Rechercher</button>
                    </form>
                </div>
                <button type="button" onClick={()=>{handleShow()}} className="mt-3 mb-3 btn btn-danger">Supprimer tout l'historique</button>
                <table className="table text-center ">
                    <thead className=" bg-warning">
                        <tr>
                            <th className="borderTh">
                            Reference commande
                            </th>
                            <th className="borderTh">
                            Client
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
                                {data.client[0].firstname} , {data.client[0].lastname} , {data.client[0].company}
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

export default HistoriqueFinancier;