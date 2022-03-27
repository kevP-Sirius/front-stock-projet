import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button,Modal} from 'react-bootstrap';
import * as moment from 'moment';
const qs = require('qs');

let Products = ({role,connect,env})=>{
    let navigate = useNavigate();
    const [forms,setForm ] = useState({designation:'',prix_achat:'',prix_vente:'',quantite_en_stock:'',date_modification:''})
    const label = {designation:'designation',prix_achat:"prix d'achat",prix_vente:'prix de vente',quantite_en_stock:'quantité en stock',date_modification:'date de modification'}
    let [mode,setMode ] = useState('add')
    let [idToUpdate,setIdToUpdate] = useState(null)
    let [errorMsg,setErrorMsg]= useState("")
    let [productsDataList , SetProductsDataList ] =useState([])
    let [products , SetProducts ] =useState([])
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let handleChange = (event)=>{
        let {name,value} = event.target
        setForm({...forms,[name]:value});
    }
    let handleEdit = async()=>{
        let test = await checkInput()
        addDateModification()
        if(test){
            let userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            let data = qs.stringify({product:{_id:idToUpdate,...forms},userInfo:userInfo})
            axios.post(`${baseUrlToUse}/products/edit`,data).then((response)=>{
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
      
        setForm(...formData)
        setIdToUpdate(id)
        setMode("edit")
    }
    let handleDeleteProduct =(id)=>{
       
        let data = qs.stringify({id:id})
        axios.post(`${baseUrlToUse}/products/delete`,data).then((response)=>{
           
            setErrorMsg(response.data.message)
            getProducts()
        }).catch((error)=>{
            
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
        axios.post(`${baseUrlToUse}/products/add`,data).then((response)=>{
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
        axios.get(`${baseUrlToUse}/products`).then((response)=>{
            let sortArray = [...response.data];
            sortArray.sort((a,b)=>{
               if(parseInt(a.quantite_en_stock)<parseInt(b.quantite_en_stock)){
                return -1
               } 
               if(parseInt(a.quantite_en_stock)>parseInt(b.quantite_en_stock)){
                return 1
               } 
               return 0
            })
            SetProductsDataList([...sortArray])
        SetProducts([...sortArray])
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
          
            connect(userInfo)
        }else{
            if(role!=="admin"){
                navigate('/')
            }
        }
        
    },[role])
    const [show, setShow] = useState(false);
    const [idToDelete, setIdToDelete] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow =(id)=> {
      
    setIdToDelete(id)
      setShow(true)
    };
    const [formSearch, setFormSearch] = useState({product:''});
    let handleSubmitSearch =(event)=>{
        event.preventDefault()
        if(formSearch.product.length==0){
            return getProducts()
        }
        let data = qs.stringify({designation:formSearch.product})
        axios.post(`${baseUrlToUse}/products/search`,data).then((response)=>{
            SetProducts([...response.data])
        })
    }
    let handleChangeSearch = (event)=>{
        let {name,value} = event.target
        setFormSearch({...formSearch,[name]:value});
    }
    return(
        <>
        <form onSubmit={handleSubmitSearch}>
            <div className="form-group">
            <label htmlFor="titre">Rechercher un produit </label>
            <input type="text" onChange={handleChangeSearch} value={formSearch.product} className="form-control" id="designation" name="product" list="productList"/>
            <datalist id="productList">
                {
                    productsDataList.map((product,index)=>{
                      return  <option key={index} value={product.designation}>{product.designation}</option>
                    })
                }
            </datalist>
            </div>
            <button type="submit" className="mt-3 mb-3 btn btn-primary">Rechercher</button>
        </form>
          <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Suppréssion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Souhaitez vous confirmer la suppréssion?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={()=>{
              handleDeleteProduct(idToDelete)
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
            <form onSubmit={handleSubmit} className="mb-3 ">
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
            <div className=" table-responsive width-tab-responsive" >
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
                                <td><button onClick={()=>{handleShow(product._id)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </>
    )
    }

    export default Products