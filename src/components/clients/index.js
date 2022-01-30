import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as moment from 'moment';
const qs = require('qs');

let Clients = ({role,connect})=>{
    let navigate = useNavigate();
    const [forms,setForm ] = useState({firstname:'',lastname:'',adress:'',company:'',ice:''})
    const label = {firstname:'nom',lastname:'prénom',adress:"adresse",company:"nom de l'entreprise",ice:'ICE',date_modification:'date de modification'}
    let [mode,setMode ] = useState('add')
    let [idToUpdate,setIdToUpdate] = useState(null)
    let [errorMsg,setErrorMsg]= useState("")
    let [clients , setClients ] =useState([])

    let getClients =()=>{
        axios.get("http://3.145.43.146:9001/clients/list").then((response)=>{
            console.log(response) 
            setClients([...response.data])
        })
    }
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let handleEdit = async()=>{
        let test = await checkInput()
        if(test){
            let data = qs.stringify({_id:idToUpdate,...forms})
            axios.post("http://3.145.43.146:9001/clients/edit",data).then((response)=>{
                setMode("add")
                resetInput()
                setErrorMsg(response.data.message)
                getClients()
            })
        }
        
    }
    let handleCancelEdit = () =>{
        resetInput()
        setIdToUpdate(null)
        setMode("add")
    }
    let handleUpdate = (id)=>{
        let formData = [...clients.filter(client=>client._id==id)]
        console.log(id)
        moment.locale('fr')
        var currentDate = moment().format("YYYY-MM-DD");
        setForm({...formData[0],date_modification:currentDate})
        setIdToUpdate(id)
        setMode("edit")
    }
    let handleDeleteClients =(id)=>{
       
        let data = qs.stringify({id:id})
        axios.post("http://3.145.43.146:9001/clients/delete",data).then((response)=>{
            console.log(response)
            setErrorMsg(response.data.message)
            getClients()
        }).catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        getClients()
    },[])
    useEffect(()=>{
        setTimeout(()=>{
            setErrorMsg('')
        },3000)
    },[errorMsg])
    useEffect(()=>{
        if(localStorage.getItem("user")!==null){
            const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            console.log(userInfo) 
            connect(userInfo)
        }else{
            if(role!=="admin"){
                navigate('/')
            }
        }
        
    },[role])
    let resetInput = ()=>{
        setForm({firstname:'',lastname:'',adress:'',company:'',ice:''})
    }
    let checkInput  = async ()=>{
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            console.log(forms[inputName])
            console.log(inputName)
            if(forms[inputName].length==0 && inputName!=="last_connexion" && inputName!=="date_modification"){
                console.log(forms[inputName])
                return  setErrorMsg(`Veuillez saisir un ${label[inputName]}`)
            }
        }
        return true
    }
    let handleSubmit =(event)=>{
        event.preventDefault()
        setForm({...forms})
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            if(forms[inputName].length==0){
                return  setErrorMsg(`Veuillez saisir un ${label[inputName]}`)
            }
        }
        let data = qs.stringify(forms)
        axios.post("http://3.145.43.146:9001/clients/add",data).then((response)=>{
            resetInput()
            setErrorMsg(response.data.message)
            getClients()
        })
    }
return(
    <>
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group">
                <label htmlFor="username">{label.firstname}</label>
                <input type="text" onChange={handleChange} value={forms.firstname} className="form-control" id="firstname" name="firstname" aria-describedby="firstname"  />
            </div>
            <div className="form-group">
                <label htmlFor="password">{label.lastname}</label>
                <input type="text" onChange={handleChange} value={forms.lastname} className="form-control" id="lastname" name="lastname" aria-describedby="lastname"  />
            </div>
            <div className="form-group">
                <label htmlFor="email">{label.adress}</label>
                <input type="text" onChange={handleChange} value={forms.adress} className="form-control" id="adress" name="adress" aria-describedby="adress"  />
            </div>
            <div className="form-group">
                <label htmlFor="Année">{label.company}</label>
                <input type="text"  onChange={handleChange} value={forms.company} className="form-control" id="company" name="company" aria-describedby="company" />
            </div>
            <div className="form-group">
                <label htmlFor="ice">{label.ice}</label>
                <input type="text"  onChange={handleChange} value={forms.ice} className="form-control" id="ice" name="ice" aria-describedby="ice" />
            </div>
            
            <div className="mt-2">
                <p className="text-danger">{errorMsg}</p>
            </div>
            {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Ajouter un client</button>}
            {mode==="edit" &&  
            <div className="d-flex justify-content-between col-lg-5 col-sm-12">
                <button type="button"  onClick={handleEdit} className="mt-3 mr-2 btn btn-warning">Confirmer modification</button>
                <button type="button" onClick={handleCancelEdit} className="mt-3 btn btn-info">Annuler modification</button>
            </div>}
        </form>
            <table className="table text-center ">
                <thead className=" bg-warning">
                    <tr>
                        <th>
                        {label.firstname}
                        </th>
                        <th>
                        {label.lastname}
                        </th>
                        <th>
                        {label.adress} 
                        </th>
                        <th>
                        {label.company}  
                        </th>
                        <th>
                        {label.ice}
                        </th>
                        <th>
                        {label.date_modification}
                        </th>
                        <th colSpan="2">
                        Actions
                        </th>
                    </tr>    
                </thead>
                <tbody>  
                    {clients.map(client=>{
                        return (
                            <tr className="text-white bg-info" key={client._id}>
                                 <td>{client.firstname}</td>
                                <td>{client.lastname}</td>
                                <td>{client.adress}</td>
                                <td>{client.company}</td>
                                <td>{client.ice}</td>
                                <td>{client.date_modification}</td>
                                <td><button onClick={()=>{handleUpdate(client._id)}} className="btn btn-warning" >Modifier</button></td>
                                <td><button onClick={()=>{handleDeleteClients(client._id)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>

    )

}
export default Clients;