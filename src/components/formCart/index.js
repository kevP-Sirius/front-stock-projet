import './formCart.scss'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import * as moment from 'moment';
const qs = require('qs');



let FormCart  =({role,isConnected,connect,env})=>{
    
    const {state} = useLocation();
    const { id } = state;
    let [products , SetProducts ] = useState([])
    let [forms,setForm ] = useState({designation:'',quantite:''})
    let [elementToUpdate ,setElementToUpdate] = useState({designation:'',quantite_en_stock:'',prix_vente:''})
    const label = {designation:'designation',quantite:'quantite'}
    let [panier,SetPanier] = useState([])
    let [ttc , SetTtc ] =useState(0)
    let [errorMsg,setErrorMsg]= useState("")
    let [mode,setMode ] = useState('add')
    let navigate = useNavigate();
    let baseUrlProd = "http://3.145.43.146:9001"
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let [operations , setOperations ] =useState([]) 
    let [optionList , setOptionList ] = useState([])
    let userInfo=null
    useEffect(()=>{
        getOperations()
        getProducts()
    },[])
    useEffect(()=>{
        if(localStorage.getItem("user")!==null){
            userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            
            connect(userInfo)
        }else{
            if(role!=="admin" && role!=="livreur"){
                navigate('/')
            }
        }
    },[role])
    let getProducts =()=>{  
        axios.get(`${baseUrlToUse}/products`).then((response)=>{
            SetProducts([...response.data])
            let data = response.data.filter(product=>parseInt(product.quantite_en_stock)>0)   
            setOptionList([...data]) 
        }) 
    }
    let getOperations =()=>{
        axios.get(`${baseUrlToUse}/command/${id}`).then((response)=>{
            
            setOperations(response.data[0])
            SetPanier(response.data[0].produit)
            let newTotal = 0
            response.data[0].produit.map(element=>{
                newTotal+=element.prix_vente*element.quantite
            })
            SetTtc(newTotal)
        })
    }
    useEffect(()=>{
        setTimeout(()=>{
            setErrorMsg("")
        },3500)
        
    },[errorMsg])
    let addArticle =(newProduct)=>{
        let searchIndex = operations.produit.findIndex(item=>item._id==newProduct._id)
        let quantiteToCheck = parseInt(forms.quantite)
        let data = qs.stringify({_id:newProduct._id,quantite:quantiteToCheck})
        
        axios.post(`${baseUrlToUse}/article/checkstock`,data).then((reponse)=>{
            
           
            if(reponse.data.status==200){
                if(searchIndex!==-1){
                    let newQuantite=parseInt(operations.produit[searchIndex].quantite)+parseInt(forms.quantite)
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:newQuantite}
                    let newProduitList = [...operations.produit]
                    let oldQte =  parseInt(newProduitList[searchIndex].quantite);
                    let quantiteToDown = 0;
                    quantiteToDown = parseInt(forms.quantite)
                    newProduitList[searchIndex]=productToAdd
                    let newQuantiteTotal=parseInt(operations.quantite)+parseInt(forms.quantite)
                    let newPrixTtc = 0
                    let newPanier = {panierToUpdate:{...operations,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:parseInt(forms.quantite),action:"add",userInfo:userInfo,quantiteToCheck:quantiteToCheck}}
                    newPanier.panierToUpdate.produit.map(product=>{
                        newQuantiteTotal+=parseInt(product.quantite);
                        newPrixTtc+=parseInt(product.quantite*product.prix_vente)
                    })
                    let restToPaid = newPrixTtc-parseInt(operations.payer_espece)+parseInt(operations.payer_cheque)
                    newPanier = {panierToUpdate:{...operations,payer_credit:restToPaid,produit:[...newProduitList],quantite:newQuantite,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:quantiteToDown,action:'add',userInfo:userInfo,quantiteToCheck:quantiteToCheck}}
                    
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                        if(response.data.status!==200){
                            setErrorMsg("stock insuffisant")
                        }
                        getProducts()
                        getOperations()
                        resetForm()
                    })
        
                }else{
                    let newQuantite = parseInt(operations.quantite)+parseInt(forms.quantite)
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:forms.quantite}
                    let newQuantiteTotal = 0 
                    let newPrixTtc = 0
                    let quantiteToDown = parseInt(forms.quantite)
                    let newPanier = {panierToUpdate:{...operations,produit:[...operations.produit,productToAdd],quantite:newQuantite,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:quantiteToDown,action:'add',userInfo:userInfo,quantiteToCheck:quantiteToCheck}}
                    newPanier.panierToUpdate.produit.map(product=>{
                        newQuantiteTotal+=parseInt(product.quantite);
                        newPrixTtc+=parseInt(product.quantite*product.prix_vente)
                    })
                    let restToPaid = newPrixTtc-parseInt(operations.payer_espece)+parseInt(operations.payer_cheque)
                    newPanier = {panierToUpdate:{...operations,payer_credit:restToPaid,produit:[...operations.produit,productToAdd],quantite:newQuantite,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:quantiteToDown,action:'add',userInfo:userInfo,quantiteToCheck:quantiteToCheck}}
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                        if(response.data.status!==200){
                            setErrorMsg("stock insuffisant")
                        }
                        getProducts()
                        getOperations()
                        resetForm()
                    })
                }
            }
        })
        
        
    }
    let editArticle =(newProduct)=>{
        let searchIndex = operations.produit.findIndex(item=>item._id==newProduct._id)
        if(searchIndex!==-1){
            let newQuantite=parseInt(forms.quantite)
            let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:newQuantite}
            let newProduitList = [...operations.produit]
            let oldQte = parseInt(newProduitList[searchIndex].quantite)
            let quantiteToDown = oldQte - newQuantite
            newProduitList[searchIndex]=productToAdd
            let newQuantiteTotal=0;
            let newPrixTtc = 0;
            let newPanier = {panierToUpdate:{...operations,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:quantiteToDown,action:'edit'}}
            newPanier.panierToUpdate.produit.map(product=>{
                newQuantiteTotal+=parseInt(product.quantite);
                newPrixTtc+=parseInt(product.quantite*product.prix_vente)
            })
            let restToPaid = newPrixTtc-parseInt(operations.payer_espece)+parseInt(operations.payer_cheque)
            newPanier = {panierToUpdate:{...operations,payer_credit:restToPaid,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id,quantiteToDown:quantiteToDown,action:'edit',userInfo:userInfo,quantiteToCheck:quantiteToDown}}
            let updateData = qs.stringify(newPanier)
            axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                if(response.data.status!==200){
                    setErrorMsg("stock insuffisant")
                }
                setMode('add')
                getProducts()
                getOperations()
                resetForm()
            })

        } 
    }
    let deleteArticle =(articleToDelete)=>{
        let newProduit = operations.produit.filter(item=>item._id!==articleToDelete._id);
        let searchIndex = operations.produit.findIndex(item=>item._id==articleToDelete._id)
        
        if(searchIndex!==-1){
            
            let newProduitList = [...operations.produit]
            let oldQte = parseInt(newProduitList[searchIndex].quantite)
            let quantiteToDown = oldQte
            let newQuantiteTotal=0;
            let newPrixTtc = 0;
            let newPanier = {panierToUpdate:{...operations,produit:[...newProduit],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:articleToDelete._id,quantiteToDown:quantiteToDown,action:'delete'}}
            newPanier.panierToUpdate.produit.map(product=>{
                newQuantiteTotal+=parseInt(product.quantite);
                newPrixTtc+=parseInt(product.quantite*product.prix_vente)
            })
            let restToPaid = newPrixTtc-parseInt(operations.payer_espece)+parseInt(operations.payer_cheque)
            newPanier = {panierToUpdate:{...operations,payer_credit:restToPaid,produit:[...newProduit],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:articleToDelete._id,quantiteToDown:quantiteToDown,action:'delete',userInfo:userInfo,quantiteToCheck:quantiteToDown}}
            let updateData = qs.stringify(newPanier)
            axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                if(response.data.status!==200){
                    setErrorMsg("stock insuffisant")
                }
                getProducts()
                getOperations()
                resetForm()
            })

        }

    }
    let handleSubmit =(event)=>{
        event.preventDefault()
        
        if(parseInt(forms.quantite)==0||isNaN(parseInt(forms.quantite))){
            return  setErrorMsg("Veuillez saisir une quantite supérieur à 0")
            
        }
        if(parseInt(forms.designation)=="Selectionnez un article"){
            return  setErrorMsg("Veuillez selectionnez un article")
            
        } 
        switch (mode) {
            case "add":
                let newArticle = products.filter(product=>product._id==forms.designation)
                addArticle(newArticle[0])
                break;
            case "edit":
                let newArticleEdit = products.filter(product=>product._id==forms.designation)
                editArticle(newArticleEdit[0])
                break;
            default:
                break;
        }
        
    }
    let handleChange =(event)=>{
        let {name,value} = event.target
        switch (name) {
            case 'designation':
                setForm({...forms,[name]:value});
                break;
            case 'quantite':
                let selectedProduct = products.filter(product=>product._id==forms.designation)
                
                let quantiteMax = 0
               
                if(mode=="add"){
                    if(selectedProduct.length>0){
                        quantiteMax = parseInt(selectedProduct[0].quantite_en_stock)
                    }
                    
                    if(parseInt(value)>quantiteMax){
                        setForm({...forms,[name]:quantiteMax});
                    }else{
                        setForm({...forms,[name]:value});
                    }
                }else{
                    let productPanierQte = panier.filter(item=>item._id==forms.designation)[0].quantite
                   
                    if(parseInt(productPanierQte)>0){
                        quantiteMax = parseInt(productPanierQte)+parseInt(selectedProduct[0].quantite_en_stock)
                    }else{
                        quantiteMax = parseInt(selectedProduct[0].quantite_en_stock)
                    }
                    if(parseInt(value)>quantiteMax){
                        setForm({...forms,[name]:quantiteMax});
                    }else{
                        setForm({...forms,[name]:value});
                    }
                }
                
               
                
                break;
            default:
                setForm({...forms,[name]:value});
                break;
        }
        
    }
    
    let handleEdit =(id)=>{
        setMode("edit")
        let productToEdit = products.filter(product=>product._id==id);
        
        let itemId = productToEdit[0]._id
        let designation = productToEdit[0].designation
        
        let prix_vente = productToEdit[0].prix_vente
        let quantite_en_stock = productToEdit[0].quantite_en_stock
        setElementToUpdate({_id:itemId,designation:designation,prix_vente:prix_vente,quantite_en_stock:quantite_en_stock})
        let quantiteToUpdate = panier.filter(item=>item._id==id)
        setForm({...forms,designation:itemId,quantite:quantiteToUpdate[0].quantite})
    }
    let handleCancelEdit =()=>{
        setMode("add")
        resetForm()
    }
    let resetForm = ()=>{
        setForm({designation:'',quantite:''});
    }
    return(
        <>
        <form onSubmit={handleSubmit} className="mb-3 ">
               {mode=="add" && <div className="form-group">
                    <label htmlFor="Pays">{label.designation}</label>
                    <select  onChange={handleChange} value={forms.designation} className="form-control" id="designation" name="designation" aria-describedby="designation" >
                    <option key={0} value="">Selectionnez un article</option>
                    {optionList.map(data=>{
                      return  <option key={data._id} value={data._id} >{data.designation} , prix de vente : {data.prix_vente} euros, stock : {data.quantite_en_stock}</option>
                    })}
                    </ select>
                </div>
                }
                {mode=="edit" && <div className="form-group">
                    <label htmlFor="Pays">{label.designation}</label>
                    <select  onChange={handleChange} value={forms.designation} className="form-control" id="designation" name="designation" aria-describedby="designation" >
                    {
                      <option key={0} value={elementToUpdate._id} >{elementToUpdate.designation} , prix de vente : {elementToUpdate.prix_vente} euros, stock : {elementToUpdate.quantite_en_stock}</option>
                    }
                    </ select>
                </div>
                }
                <div className="form-group">
                    <label htmlFor="Pays">{label.quantite}</label>
                    <input type="number" onChange={handleChange} value={forms.quantite} className="form-control" id="quantite" name="quantite" aria-describedby="quantite"  />
                </div>
                <div className="mt-2">
                    <p className="text-danger">{errorMsg}</p>
                </div>
                {mode==="add" && <button type="submit" className="mt-3 btn btn-success">Ajouter un produit</button>}
                {mode==="edit" &&  
                <div className="d-flex justify-content-between col-lg-5 col-sm-12">
                    <button type="submit" className="mt-3 mr-2 btn btn-warning">Confirmer modification</button>
                    <button type="button" onClick={handleCancelEdit} className="mt-3 btn btn-info">Annuler modification</button>
                </div>}
                

            </form>
         <div className="d-flex justify-content-center mb-3"><h6>numéro de commande : {id} </h6></div>
         <div className="d-flex justify-content-center mb-3"><h6>total commande ttc: {ttc} euros </h6></div>
         <div className=" table-responsive width-tab-responsive" >
            <table className="table text-center ">
                <thead className=" bg-warning">
                    <tr>
                        <th>
                        Designation
                        </th>
                        <th>
                        prix unitaire
                        </th>
                        <th>
                        quantite
                        </th>
                        <th>
                        total article
                        </th>
                        <th colSpan="2">
                        Actions
                        </th>
                    </tr>    
                </thead>
                <tbody>  
                    {panier.map(item=>{
                        
                        return (
                            <tr className="text-white bg-info" key={item._id}>
                                <td>{item.designation}</td>
                                <td>{item.prix_vente} €</td>
                                <td>{item.quantite}</td>
                                <td>{parseInt(item.quantite) * parseInt(item.prix_vente)} €</td>
                                <td><button onClick={()=>{handleEdit(item._id)}} className="btn btn-warning" >Modifier</button></td>
                                <td><button onClick={()=>{deleteArticle(item)}} className="btn btn-danger" >Supprimer</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        </>
    )

}

export default FormCart;