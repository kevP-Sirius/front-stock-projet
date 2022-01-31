import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import * as moment from 'moment';
const qs = require('qs');

let Commands =({env})=>{
    console.log(env)
    const {state} = useLocation();
    const { id } = state;
    let [operations , setOperations]=useState([])
    let [clients, setClients]=useState([])
    let navigate = useNavigate();
    const [forms,setForm ] = useState({_id:''})
    const label = {_id:'numero de commande'}
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let getCommands=()=>{
        
    }
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let getClients=()=>{
        axios.get(`${baseUrlToUse}/clients/list`).then(response=>{
            setClients(response.data)
        })
    }
    let label ={_id:'numéro de commande'}
    useEffect(()=>{
        if(localStorage.getItem("user")!==null){
            const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            console.log(userInfo) 
            connect(userInfo)
        }else{
            if(role!=="admin" && role!=="comptable"){
                navigate('/')
            }
        }
        setOperations([])
    },[role])
    let handleSubmit =()=>{

    }
    useEffect(()=>{
        getClients()
        getCommands()
    },[])
    return(

        <>
         <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label htmlFor="titre">{label._id}</label>
                    <select type="text" onChange={handleChange} value={forms._id} className="form-control" id="_id" name="_id" aria-describedby="_id"  >
                    {clients.map((client)=>{
                        return <option value={client._id}>{client.firstname},{client.lastname},{client.company}</option>
                    })}
                    </select>
                </div>
                <div className="mt-2">
                    <p className="text-danger">{errorMsg}</p>
                </div>
                {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Créer une opération</button>}
            </form>
         <table className="table text-center ">
                <thead className=" bg-warning">
                    <tr>
                        <th>
                        {label._id}
                        </th>
                        <th colSpan="2">
                        Actions
                        </th>
                    </tr>    
                </thead>
                <tbody>  
                    {operations.map(operations=>{
                        return (
                            <tr className="text-white bg-info" key={operations._id}>
                                <td>{operations._id}</td>
                                <td><button onClick={()=>{handleUpdate(operations._id)}} className="btn btn-warning" >Modifier</button></td>
                                {role=="admin" && 
                                <>
                                    <td><button onClick={()=>{handleDeleteOperations(operations._id)}} className="btn btn-danger" >Supprimer</button></td>
                                </>}
                                
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Commands;