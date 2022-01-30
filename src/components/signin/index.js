import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './signin.scss'
let Signin =({login,messageError,updateErrorMessage,messageStatus})=>{
    let navigate = useNavigate();
    let [forms , setForms] = useState({login:'',password:''})
    let handleChange = (event)=>{
        let  {name,value} = event.target
        setForms({...forms,[name]:value});
    }
    let reverseName =  {login:'identifiant',password:'mot de passe'}
    let handleSubmit = (event)=>{
        event.preventDefault()
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            console.log(forms[inputName].length)
            if(forms[inputName].length==0){
                return  updateErrorMessage({status:'',message:`Veuillez saisir un ${reverseName[inputName]}`})
            }
        }
        login(forms)
    }
    useEffect(()=>{
        setTimeout(()=>{
            updateErrorMessage("")
        },4000)
        console.log(messageStatus==200)
        if(messageStatus==200){
            console.log('navigation')
            navigate("/")
        }
    },[messageError,messageStatus])
    
    return(
        <div className="d-flex justify-content-center">
            <form className="formSignin" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="login" className="form-label">identifiant</label>
                <input type="text" onChange={handleChange} value={forms.login} className="form-control" name="login"  />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">mot de passe</label>
                <input type="password" onChange={handleChange} value={forms.password} className="form-control" name="password" />
                <div className="text-danger">{messageError}</div>
            </div>
            
            <button type="submit" className="btn btn-primary">Connexion </button>
            </form>
        </div>
    )
}

export default Signin;