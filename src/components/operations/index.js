import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as moment from 'moment';
import './operations.scss'
const qs = require('qs');

let Operations = ({role,connect,env})=>{
    let navigate = useNavigate();
    let [forms,setForm ] = useState({client:'',payer_espece:"0",payer_cheque:'0',payer_credit:'0'})
    let [clients,setClients] =useState([])
    const label = {_id:'n° commande',owner:'utilisateur',role:'role',product:'produit',client:'client',prix_ttc:"ttc",prix_vente:"prix de vente", date_operation:"date",date_modification:'modification',quantite:"quantite",payer_espece:"espèce",payer_cheque:'chèque',payer_credit:'montant à régler'}
    let [mode,setMode ] = useState('add')
    let [errorMsg,setErrorMsg]= useState("")
    let [operations , setOperations ] =useState([]) 
    let [benefice,setBenefice ]= useState({previsionnel:0,actuel:0})
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let [idToEdit,setIdToEdit] = useState(0)
    let getClients=()=>{
        axios.get(`${baseUrlToUse}/clients/list`).then(response=>{
            setClients(response.data)
        })
    }
    let getOperations =()=>{
        let userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({userInfo:userInfo})
        axios.post(`${baseUrlToUse}/operations/list`,data).then((response)=>{
            setBenefice({...benefice,actuel:0,previsionnel:0});
            setOperations([...response.data])
        })
    }
    let resetForm =()=>{
        setForm({client:'',payer_espece:"",payer_cheque:'',payer_credit:''})
    } 
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let handlePanier=(id)=>{
        navigate(`/formcart`,{state:{id:id}})
    }
    let handleDeleteOperations=(id)=>{
        let userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({id:id,userInfo:userInfo})
 
        axios.post(`${baseUrlToUse}/operations/delete`,data).then((response)=>{
            setErrorMsg(response.data.message)
            getOperations()
        }) 
    }
    let handleEdit = (id)=>{
        setMode("edit")
        let OperationToEdit = operations.filter(op=>op._id==id);
        setIdToEdit(id);
        setForm({
            client:OperationToEdit[0].client[0]._id,
            payer_espece:OperationToEdit[0].payer_espece,
            payer_cheque:OperationToEdit[0].payer_cheque,
            payer_credit:OperationToEdit[0].payer_credit
        })
        
    }
    let handleCancelEdit = () =>{
        setMode("add")
    }
    let handleUpdateData =()=>{
        let userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let newClient = clients.filter(client=>client._id==forms.client);
        let newPayerCheque = forms.payer_cheque
        let newPayerEspece = forms.payer_espece
        let newPayerCredit = (parseInt(operations.filter(op=>op._id===idToEdit)[0].prix_ttc))-(parseInt(newPayerCheque)+parseInt(newPayerEspece));
        let OperationToEdit = {userInfo:userInfo,panierToUpdate:{...operations.filter(op=>op._id===idToEdit)[0],client:newClient,payer_credit:newPayerCredit,payer_cheque:newPayerCheque,payer_espece:newPayerEspece}};
        let data = qs.stringify(OperationToEdit)
        axios.post(`${baseUrlToUse}/operation/update`,data).then((response)=>{
            setMode("add")
            resetForm()
            setErrorMsg(response.data.message)
            getOperations()
        }) 
    }
    let handleSubmit =(event)=>{
        event.preventDefault()
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            if(forms[inputName].length==0){
                return  setErrorMsg(`Veuillez saisir un ${label[inputName]}`)
            }
        }
        let clientToAdd = clients.filter(client=>client._id==forms.client)
        let userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({...forms,client:clientToAdd,userInfo:userInfo})
 
        axios.post(`${baseUrlToUse}/operations/add`,data).then((response)=>{
            resetForm()
            setErrorMsg(response.data.message)
            getOperations()
        }) 
    }
    useEffect(()=>{
        getOperations()
        getClients()
    },[])
    useEffect(()=>{
        let t = setTimeout(()=>{
            setErrorMsg('')
        },3000)
        return () => clearTimeout(t);
    },[errorMsg])
    useEffect(()=>{
        if(localStorage.getItem("user")!==null){
            const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
           
            connect(userInfo)
        }else{
            if(role!=="admin" && role!=="comptable"){
                navigate('/')
            }
        }
        
    },[role])
    useEffect(()=>{
        let actuel=0;
        let previsionnel=0;
        operations.map((operation,index)=>{
            actuel+=parseInt(operation.payer_cheque)+parseInt(operation.payer_espece)
            previsionnel+=parseInt(operation.prix_ttc)
            if(index+1==operations.length){
                setBenefice({...benefice,actuel:actuel,previsionnel:previsionnel})
            }
        })
        
    },[operations])
    
return(
       
        <> 
        <>
        {(role=="admin") && 
            <h1 className="mb-3">Bénéfice actuel : {benefice.actuel} / Bénéfice previsionnel : {benefice.previsionnel}</h1>
        }
        
        </>
        {(role =="admin"||role=="livreur") &&
        
        <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label htmlFor="titre">{label.client}</label>
                    <select type="text" onChange={handleChange} value={forms.client} className="form-control" id="designation" name="client" aria-describedby="client">
                    <option key={0} value="">Selectionnez un client</option>
                    {clients.map((client,index)=>{
                        return <option key={index+1} value={client._id}>{client.firstname} , {client.lastname} , {client.company}</option>
                    })}
                    </select>
                </div>
                <div className={role=="admin"?"form-group":"d-none"}>
                    <label htmlFor="payer_espece">{label.payer_espece}</label>
                    <input type="number"  onChange={handleChange} value={forms.payer_espece} className="form-control" id="payer_espece" name="payer_espece" aria-describedby="payer_espece"  />
                </div>
                <div className={role=="admin"?"form-group":"d-none"}>
                    <label htmlFor="payer_cheque">{label.payer_cheque}</label>
                    <input type="number" onChange={handleChange} value={forms.payer_cheque} className="form-control" id="payer_cheque" name="payer_cheque" aria-describedby="payer_cheque"  />
                </div>
                <div className="d-none">
                    <label htmlFor="payer_credit">{label.payer_credit}</label>
                    <input type="number" onChange={handleChange} value={forms.payer_credit} className="form-control" id="payer_credit" name="payer_credit" aria-describedby="payer_credit"  />
                </div>
                <div className="mt-2">
                    <p className="text-danger">{errorMsg}</p>
                </div>
                {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Ajouter une commande</button>}
                {mode==="edit" &&  
                <div className="d-flex justify-content-between col-lg-5 col-sm-12">
                    <button type="button"  onClick={handleUpdateData} className="mt-3 mr-2 btn btn-warning">Confirmer modification</button>
                    <button type="button" onClick={handleCancelEdit} className="mt-3 btn btn-info">Annuler modification</button>
                </div>}
                

            </form>
        
        }
        <div className=" table-responsive width-tab-responsive" >
            <table className="table text-center ">
                <thead className=" bg-warning">
                    <tr>
                        <th className="borderTh">
                        {label._id}
                        </th>
                        {role=="admin" && <>
                        <th className="borderTh">
                        {label.owner}
                        </th>
                        <th className="borderTh">
                        {label.role}
                        </th></>}
                        
                        <th className="borderTh">
                        {label.client}
                        </th>
                        <th className="borderTh">
                        {label.quantite} 
                        </th>
                        <th className="borderTh">
                        {label.prix_ttc} 
                        </th>
                        <th className="borderTh">
                        {label.payer_espece}  
                        </th>
                        <th className="borderTh">
                        {label.payer_cheque}
                        </th>
                        <th className="borderTh">
                        {label.payer_credit}
                        </th>
                        <th className="borderTh">
                        {label.date_operation}
                        </th>
                        <th className="borderTh">
                        {label.date_modification}
                        </th>
                        <th colSpan="3" className="borderTh">
                        Actions
                        </th>
                    </tr>    
                </thead>
                <tbody>  
                    {operations.map(operations=>{
                        return (
                            <tr className="text-white bg-info" key={operations._id}>
                                <td>{operations._id}</td>
                                {role=="admin" && 
                                <>
                                <td>{operations.owner}</td>
                                <td>{operations.role}</td>
                                </>}
                                
                                <td>{operations.client[0].company}</td>
                                <td>{operations.quantite}</td>
                                <td>{operations.prix_ttc}</td>
                                <td>{operations.payer_cheque}</td>
                                <td>{operations.payer_espece}</td>
                                <td>{operations.payer_credit}</td>
                                <td>{operations.date_operation}</td>
                                <td>{operations.date_modification}</td>
                                <td>{(role=="admin"||role=="livreur") && <><button onClick={()=>{handlePanier(operations._id)}} className="btn btn-warning" >Panier</button></>}</td>
                                <td>{(role=="admin") && <><button onClick={()=>{handleEdit(operations._id)}} className="btn btn-primary" >Modifier</button></>}</td>
                                <td>{role=="admin"&& <><button onClick={()=>{handleDeleteOperations(operations._id)}} className="btn btn-danger" >Supprimer</button></>}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </>

    )

}
export default Operations;