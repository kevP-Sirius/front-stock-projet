import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as moment from 'moment';
const qs = require('qs');

let Products = ({role,connect})=>{
    let navigate = useNavigate();
    const [forms,setForm ] = useState({designation:'',prix_achat:'',prix_vente:'',quantite_en_stock:'',date_modification:''})
    const label = {designation:'designation',prix_achat:"prix d'achat",prix_vente:'prix de vente',quantite_en_stock:'quantité en stock',date_modification:'date de modification'}
    let [mode,setMode ] = useState('add')
    let [idToUpdate,setIdToUpdate] = useState(null)
    let [errorMsg,setErrorMsg]= useState("")
    let [products , SetProducts ] =useState([])
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let handleEdit = async()=>{
        let test = await checkInput()
        addDateModification()
        if(test){
            let data = qs.stringify({_id:idToUpdate,...forms})
            axios.post("http://3.145.43.146:9001/products/edit",data).then((response)=>{
                setMode("add")
                resetInput()
                setErrorMsg(response.data.message)
                getProducts()
            })
        }
        
    }
    let handleCancelEdit = () =>{
        resetInput()
        setIdToUpdate(null)
        setMode("add")
    }
    let handleUpdate = (id)=>{
        let formData = products.filter(product=>product._id==id)
        console.log(products)
        setForm(...formData)
        setIdToUpdate(id)
        setMode("edit")
    }
    let handleDeleteProduct =(id)=>{
       
        let data = qs.stringify({id:id})
        axios.post("http://3.145.43.146:9001/products/delete",data).then((response)=>{
            console.log(response)
            setErrorMsg(response.data.message)
            getProducts()
        }).catch((error)=>{
            console.log(error)
        })
    }
    let resetInput = ()=>{
        setForm({designation:'',prix_achat:'',prix_vente:'',quantite_en_stock:'',date_modification:''})
    }
    let checkInput  = async ()=>{
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            if(forms[inputName].length==0 && inputName!="date_modification"){
                return  setErrorMsg(`Veuillez saisir un ${label[inputName]}`)
            }
        }
        return true
    }
    let handleSubmit =(event)=>{
        event.preventDefault()
        for (let index = 0; index < Object.keys(forms).length; index++) {
            let inputName =Object.keys(forms)[index]
            if(forms[inputName].length==0 && inputName!="date_modification" ){
                return  setErrorMsg(`Veuillez saisir un ${label[inputName]}`)
            }
        }
        let data = qs.stringify(forms)
        axios.post("http://3.145.43.146:9001/products/add",data).then((response)=>{
            setForm({designation:'',prix_achat:'',prix_vente:'',quantite_en_stock:'',date_modification:''})
            setErrorMsg(response.data.message)
            getProducts()
        })
    }
    let addDateModification =( )=>{
        moment.locale('fr')
        var currentDate = moment().format("DD-MM-YYYY");
        setForm({...forms,date_modification:currentDate})
    }
    let getProducts =()=>{
        axios.get("http://3.145.43.146:9001/products").then((response)=>{
        console.log(response) 
        SetProducts([...response.data])
    }) 
    }
    useEffect(()=>{
        getProducts()
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
    
    return(
        <>
            <form onSubmit={handleSubmit} className="mb-3">
                <div className="form-group">
                    <label htmlFor="titre">{label.designation}</label>
                    <input type="text" onChange={handleChange} value={forms.designation} className="form-control" id="designation" name="designation" aria-describedby="designation"  />
                </div>
                <div className="form-group">
                    <label htmlFor="Auteur">{label.prix_achat}</label>
                    <input type="number" onChange={handleChange} value={forms.prix_achat} className="form-control" id="prix_achat" name="prix_achat" aria-describedby="prix_achat"  />
                </div>
                <div className="form-group">
                    <label htmlFor="Année">{label.prix_vente}</label>
                    <input type="number"  onChange={handleChange} value={forms.prix_vente} className="form-control" id="prix_vente" name="prix_vente" aria-describedby="prix_vente"  />
                </div>
                <div className="form-group">
                    <label htmlFor="Prix">{label.quantite_en_stock}</label>
                    <input type="number" onChange={handleChange} value={forms.quantite_en_stock} className="form-control" id="quantite_en_stock" name="quantite_en_stock" aria-describedby="quantite_en_stock"  />
                </div>
                <div className="d-none form-group">
                    <label htmlFor="Pays">{label.date_modification}</label>
                    <input type="date" onChange={handleChange} value={forms.date_modification} className="form-control" id="date_modification" name="date_modification" aria-describedby="date_modification"  />
                </div>
                <div className="mt-2">
                    <p className="text-danger">{errorMsg}</p>
                </div>
                {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Ajouter un produit</button>}
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
                        {label.designation}
                        </th>
                        <th>
                        {label.prix_achat}
                        </th>
                        <th>
                        {label.prix_vente} 
                        </th>
                        <th>
                        {label.quantite_en_stock}  
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
                    {products.map(product=>{
                        return (
                            <tr className="text-white bg-info" key={product._id}>
                                 <td>{product.designation}</td>
                                <td>{product.prix_achat}</td>
                                <td>{product.prix_vente}</td>
                                <td>{product.quantite_en_stock}</td>
                                <td>{product.date_modification}</td>
                                <td><button onClick={()=>{handleUpdate(product._id)}} className="btn btn-warning" >Modifier</button></td>
                                <td><button onClick={()=>{handleDeleteProduct(product._id)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
    }

    export default Products