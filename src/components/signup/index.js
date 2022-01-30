import { useState,useEffect } from "react";

let Signup =({updateErrorMessage,messageError,signup,messageStatus})=>{
    let [forms , setForms] = useState({login:'',password:'',email:'',role:'admin'})
    let env="prod"
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let handleChange = (event)=>{
    let  {name,value} = event.target
    setForms({...forms,[name]:value});
    }
    let reverseName =  {login:'identifiant',password:'mot de passe',email:'email',role:'role'}
    let handleSubmit = (event)=>{
        event.preventDefault()
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            if(forms[inputName].length==0){
                return  updateErrorMessage({status:'',message:`Veuillez saisir un ${reverseName[inputName]}`})
            }
        }
        signup(forms)
    }
    useEffect(()=>{
        if(messageStatus=="201"){
            setForms({login:'',password:'',email:'',role:''})
        }
        console.log(messageError)
        setTimeout(()=>{
            updateErrorMessage("")
        },3500)
        
    },[messageError])
    return(
        <div className="d-flex justify-content-center">
            <form className="formSignin" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="login" className="form-label">identifiant</label>
                <input type="text" onChange={handleChange} value={forms.login} className="form-control" name="login"  />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">email</label>
                <input type="email" onChange={handleChange} value={forms.email} className="form-control" name="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">role</label>
                <select type="role" onChange={handleChange} value={forms.role} className="form-control" name="role" >
                    <option value="admin">admin</option>
                    <option value="comptable">comptable</option>
                    <option value="livreur">livreur</option>
                </select >
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">mot de passe</label>
                <input type="password" onChange={handleChange} value={forms.password} className="form-control" name="password" />
                <div className="text-danger">{messageError}</div>
            </div>
            
            <button type="submit" className="btn btn-primary">Crée un compte </button>
            </form>
        </div>
    )
}

export default Signup;