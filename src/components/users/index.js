import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as moment from 'moment';
const qs = require('qs');

let Users = ({role,connect})=>{
    let navigate = useNavigate();
    const [forms,setForm ] = useState({username:'',password:'',email:'',role:'admin'})
    const label = {username:'identifiant',password:'mot de passe',email:"email",role:'role',last_connexion:'dernière connexion',date_modification:'date de modification'}
    let [mode,setMode ] = useState('add')
    let [idToUpdate,setIdToUpdate] = useState(null)
    let [errorMsg,setErrorMsg]= useState("")
    let [users , setUsers ] =useState([])

    let getUsers =()=>{
        axios.get("http://localhost:9001/users/list").then((response)=>{
            console.log(response) 
            setUsers([...response.data])
        })
    }
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let handleEdit = async()=>{
        let test = await checkInput()
        if(test){
            var currentDate = moment().format("DD-MM-YYYY");
            let data = qs.stringify({_id:idToUpdate,...forms,date_modification:currentDate})
            axios.post("http://localhost:9001/users/edit",data).then((response)=>{
                setMode("add")
                resetInput()
                setErrorMsg(response.data.message)
                getUsers()
            })
        }
        
    }
    let handleCancelEdit = () =>{
        resetInput()
        setIdToUpdate(null)
        setMode("add")
    }
    let handleUpdate = (id)=>{
        let formData = [...users.filter(user=>user._id==id)]
        console.log(id)
        moment.locale('fr')
        var currentDate = moment().format("YYYY-MM-DD");
        setForm({...formData[0],date_modification:currentDate})
        setIdToUpdate(id)
        setMode("edit")
    }
    let handleDeleteUser =(id)=>{
       
        let data = qs.stringify({id:id})
        axios.post("http://localhost:9001/users/delete",data).then((response)=>{
            console.log(response)
            setErrorMsg(response.data.message)
            getUsers()
        }).catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        getUsers()
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
        setForm({username:'',email:'',password:'',role:''})
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
        axios.post("http://localhost:9001/users/add",data).then((response)=>{
            resetInput()
            setErrorMsg(response.data.message)
            getUsers()
        })
    }
return(
    <>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label htmlFor="username">{label.username}</label>
                    <input type="text" onChange={handleChange} value={forms.username} className="form-control" id="username" name="username" aria-describedby="username"  />
                </div>
                <div className={mode=="add"?"form-group":" d-none form-group"}>
                    <label htmlFor="password">{label.password}</label>
                    <input type="password" onChange={handleChange} value={forms.password} className="form-control" id="password" name="password" aria-describedby="password"  />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{label.email}</label>
                    <input type="email" onChange={handleChange} value={forms.email} className="form-control" id="email" name="email" aria-describedby="email"  />
                </div>
                <div className="form-group">
                    <label htmlFor="Année">{label.role}</label>
                    <select type="number"  onChange={handleChange} value={forms.role} className="form-control" id="role" name="role" aria-describedby="role">
                    <option value="">Selectionnez un role</option>
                        <option value="admin">admin</option>
                        <option value="comptable">comptable</option>
                        <option value="livreur">livreur</option>
                    </select>    
                </div>
               
                <div className="mt-2">
                    <p className="text-danger">{errorMsg}</p>
                </div>
                {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Ajouter un utilisateur</button>}
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
                        {label.username}
                        </th>
                        <th>
                        {label.email}
                        </th>
                        <th>
                        {label.role} 
                        </th>
                        <th>
                        {label.last_connexion}  
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
                    {users.map(user=>{
                        return (
                            <tr className="text-white bg-info" key={user._id}>
                                 <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.last_connexion}</td>
                                <td>{user.date_modification}</td>
                                <td><button onClick={()=>{handleUpdate(user._id)}} className="btn btn-warning" >Modifier</button></td>
                                <td><button onClick={()=>{handleDeleteUser(user._id)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>

    )

}
export default Users;