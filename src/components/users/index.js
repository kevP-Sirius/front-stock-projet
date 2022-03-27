import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button,Modal} from 'react-bootstrap';
import * as moment from 'moment';
const qs = require('qs');

let Users = ({role,connect,env})=>{
    let navigate = useNavigate();
    const [forms,setForm ] = useState({username:'',password:'',email:'',role:'admin'})
    const label = {username:'identifiant',password:'mot de passe',email:"email",role:'role',state:'etat',last_connexion:'dernière connexion',date_modification:'date de modification'}
    let [mode,setMode ] = useState('add')
    let [idToUpdate,setIdToUpdate] = useState(null)
    let [errorMsg,setErrorMsg]= useState("")
    let [users , setUsers ] =useState([])
    let [usersDataList , setUsersDataList] =useState([])
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let getUsers =()=>{
        axios.get(`${baseUrlToUse}/users/list`).then((response)=>{
           
            setUsers([...response.data])
            setUsersDataList([...response.data])
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
            axios.post(`${baseUrlToUse}/users/edit`,data).then((response)=>{
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
     
        moment.locale('fr')
        var currentDate = moment().format("YYYY-MM-DD");
        setForm({...formData[0],date_modification:currentDate})
        setIdToUpdate(id)
        setMode("edit")
    }
    let handleDeleteUser =(id)=>{
       
        let data = qs.stringify({id:id})
        axios.post(`${baseUrlToUse}/users/delete`,data).then((response)=>{
          
            setErrorMsg(response.data.message)
            getUsers()
        }).catch((error)=>{
           
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
          
            if(forms[inputName].length==0 && inputName!=="last_connexion" && inputName!=="date_modification"){
             
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
        axios.post(`${baseUrlToUse}/users/add`,data).then((response)=>{
            resetInput()
            setErrorMsg(response.data.message)
            getUsers()
        })
    }
    const [show, setShow] = useState(false);
    const [idToDelete, setIdToDelete] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow =(id)=> {
      
    setIdToDelete(id)
      setShow(true)
    };
    let handleActiveAccount =(id)=>{
        const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({id:id,userInfo:userInfo})
        axios.post(`${baseUrlToUse}/user/active`,data).then((response)=>{
            resetInput()
            setErrorMsg(response.data.message)
            getUsers()
        })
    }
    let handleDesactiveAccount =(id)=>{
        const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
        let data = qs.stringify({id:id,userInfo:userInfo})
        axios.post(`${baseUrlToUse}/user/desactive`,data).then((response)=>{
            resetInput()
            setErrorMsg(response.data.message)
            getUsers()
        })
    }
    const [formSearch, setFormSearch] = useState({username:''});
    let handleSubmitSearch =(event)=>{
        event.preventDefault()
        if(formSearch.username.length==0){
            return getUsers()
        }
        let data = qs.stringify({username:formSearch.username})
        axios.post(`${baseUrlToUse}/users/search`,data).then((response)=>{
            setUsers([...response.data])
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
                <label htmlFor="username">Rechercher un utilisateur</label>
                <input type="text" onChange={handleChangeSearch} value={formSearch.username} className="form-control" id="username" name="username" list="usersList"/>
                <datalist id="usersList">
                    {
                        usersDataList.map((user,index)=>{
                            return  <option key={index} value={user.username}> {user.username} , {user.email} , {user.role} </option>
                        })
                    }
                </datalist>
                </div>
                <button type="submit" className="mt-3 mb-3 btn btn-primary">Rechercher</button>
            </form>
        </>
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Suppréssion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Souhaitez vous confirmer la suppréssion?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={()=>{
              handleDeleteUser(idToDelete)
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
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label htmlFor="username">{label.username}</label>
                    <input type="text" onChange={handleChange} value={forms.username} autoComplete="off" className="form-control" id="username" name="username" aria-describedby="username"  />
                </div>
                <div className={mode=="add"?"form-group":" d-none form-group"}>
                    <label htmlFor="password">{label.password}</label>
                    <input type="password" onChange={handleChange} value={forms.password} autoComplete="off" className="form-control" id="password" name="password" aria-describedby="password"  />
                </div>
                <div className="form-group">
                    <label htmlFor="email">{label.email}</label>
                    <input type="email" onChange={handleChange} value={forms.email} className="form-control" id="email" name="email" aria-describedby="email"  />
                </div>
                <div className="form-group">
                    <label htmlFor="Année">{label.role}</label>
                    <select type="number"  onChange={handleChange} value={forms.role} className="form-control" id="role" name="role" aria-describedby="role">
                    <option key={0} value="">Selectionnez un role</option>
                        <option  key={1} value="admin">admin</option>
                        <option  key={2} value="comptable">comptable</option>
                        <option  key={3} value="livreur">livreur</option>
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
            <div className=" table-responsive width-tab-responsive" >
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
                        {label.state} 
                        </th>
                        <th>
                        {label.last_connexion}  
                        </th>
                        <th>
                        {label.date_modification}
                        </th>
                        <th colSpan="3">
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
                                <td>{user.etat==0?"compte désactiver":"compte activer"}</td>
                                <td>{user.last_connexion}</td>
                                <td>{user.date_modification}</td>
                                {user.state!==1 && <>
                                    <td><button onClick={()=>{handleActiveAccount(user._id)}} className="btn btn-primary" >Activez le compte</button></td>
                                </>}
                                {user.state==1 && <>
                                    <td><button onClick={()=>{handleDesactiveAccount(user._id)}} className="btn btn-primary" >Desactivez le compte</button></td>
                                </>}
                                <td><button onClick={()=>{handleUpdate(user._id)}} className="btn btn-warning" >Modifier</button></td>
                                <td><button onClick={()=>{handleShow(user._id)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </>

    )

}
export default Users;