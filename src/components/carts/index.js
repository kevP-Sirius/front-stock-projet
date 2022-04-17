import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import * as moment from 'moment';
import './cart.scss'
const qs = require('qs');

let Cart =({role,isConnected,connect,env,ipProd})=>{
    
    const {state} = useLocation();
    const { id } = state;
    let [products , SetProducts ] =useState([])
    let [command,setCommand] = useState({
    client:"",
    produit : [] ,
    quantite:0,
    prix_ttc:0,
    payer_espece:0 ,
    payer_cheque:0 ,
    payer_credit:0 ,
    date_operation : "" ,
    date_modification: ""})
    let label = {quantite:'quantite total',sous_total:'sous-total ttc'}
    let navigate = useNavigate();
    let baseUrlProd = `http://${ipProd}:9001`
    let baseUrlLocal = "http://localhost:9001"
    let baseUrlToUse = env=="dev"?baseUrlLocal:baseUrlProd
    let getProducts =()=>{  
        axios.get(`${baseUrlToUse}/products`).then((response)=>{
           
            SetProducts([...response.data])
        }) 
    }
    let getCommand =()=>{
        axios.get(`${baseUrlToUse}/command/${id}`).then((response)=>{
            console.log(response.data)
            setCommand({...response.data[0]})   
             
        }) 
    } 
    useEffect(()=>{
        getCommand()
        getProducts()

    },[])
    useEffect(()=>{
        
    },[command])
    useEffect(()=>{
        if(localStorage.getItem("user")!==null){
            const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            
            connect(userInfo)
        }else{
            if(role!=="admin" && role!=="livreur"){
                navigate('/')
            }
        }
        
    },[role])
    let artPanier = (id)=>{
        let artPanier = command.produit.filter(item=>item._id==id)
        if(artPanier.length>0){
         return   artPanier[0].quantite
        }else{
            return 0
        }
    }
    let addArticle =(newProduct)=>()=>{
        let searchIndex = command.produit.findIndex(item=>item._id==newProduct._id)
        let data = qs.stringify({_id:newProduct._id})
            
        axios.post(`${baseUrlToUse}/article/checkstock`,data).then((reponse)=>{
            console.log(reponse.data.status)
            if(reponse.data.status==200){
                if(searchIndex!==-1){
                    let newQuantite=parseInt(command.produit[searchIndex].quantite)+1
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:newQuantite}
                    let newProduitList = [...command.produit]
                    newProduitList[searchIndex]=productToAdd
                    let newQuantiteTotal=parseInt(command.quantite)+1
                    let newPrixTtc = parseInt(command.prix_ttc)+parseInt(productToAdd.prix_vente)
                    let newPanier = {panierToUpdate:{...command,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id}}
                    console.log(newPanier)
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                        getProducts()
                        getCommand()
                    })
        
                }else{
                    let newQuantite = parseInt(command.quantite)+1
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:1}
                    let newPrixTtc = parseInt(command.prix_ttc)+parseInt(productToAdd.prix_vente)
                    let newPanier = {panierToUpdate:{...command,produit:[...command.produit,productToAdd],quantite:newQuantite,prix_ttc:newPrixTtc},productToDownStock:{_id:productToAdd._id}}
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update`,updateData).then((response)=>{
                        getProducts()
                        getCommand()
                    })
                }
            }
        })
        
        
    }
    let removeArticle =(newProduct)=>()=>{
        let searchIndex = command.produit.findIndex(item=>item._id==newProduct._id)
        console.log('click')
        let data = qs.stringify({_id:newProduct._id})
            
        axios.post(`${baseUrlToUse}/article/checkstock`,data).then((reponse)=>{
            console.log(reponse.data.status)
            
            if(searchIndex!==-1){
                let newQuantite=parseInt(command.produit[searchIndex].quantite)-1
                if(newQuantite>0){
                    let newQuantiteTotal = parseInt(command.quantite)-1
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:newQuantite}
                    let newProduitList = [...command.produit]
                    newProduitList[searchIndex]=productToAdd
                    let newPrixTtc = parseInt(command.prix_ttc)-parseInt(productToAdd.prix_vente)
                    let newPanier = {panierToUpdate:{...command,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToUpStock:{_id:productToAdd._id}}
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update/reduce`,updateData).then((response)=>{
                        getProducts()
                        getCommand()
                    })
        
                }
                if(newQuantite==0){
                    let newQuantiteTotal = parseInt(command.quantite)-1
                    let productToAdd = {_id:newProduct._id,designation:newProduct.designation,prix_vente:newProduct.prix_vente,quantite:newQuantite}
                    let newProduitList = [...command.produit.filter(item=>item._id!==newProduct._id)]
                    let newPrixTtc = parseInt(command.prix_ttc)-parseInt(productToAdd.prix_vente)
                    let newPanier = {panierToUpdate:{...command,produit:[...newProduitList],quantite:newQuantiteTotal,prix_ttc:newPrixTtc},productToUpStock:{_id:productToAdd._id}}
                    let updateData = qs.stringify(newPanier)
                    axios.post(`${baseUrlToUse}/panier/update/reduce`,updateData).then((response)=>{
                        getProducts()
                        getCommand()
                    })
                }
            
            }
            
        })
        
        
    }
    return (
        <>
        <div className="d-flex justify-content-center mb-3"><p>numéro de commande : {id} </p></div>
            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-around">
                <div className="col-8 m-3">
                    {products.map((product,index)=>{
                        return(
                                <div className="card cardStyle"  key={product._id}>
                                <div className="card-body" key={product._id} >
                                <h5 className="card-title">{product.designation}</h5>
                                <p className="card-text">prix : {product.prix_vente} euros</p>
                                <p className="card-text">stock : {product.quantite_en_stock}</p>
                                <p className="card-text"><button onClick={removeArticle(product)} className="btn bi bi-dash-square btnCard"></button> {artPanier(product._id)} <button onClick={addArticle(product)} className="btn btnCard bi bi-plus-square"></button></p>
                                </div>
                                </div>
                            )
                        }
                        )
                    }
                </div>
                <>  
                    <div className="">
                    <div className="panierTab" style={{'max-width':'fit-content'}}>
                    <div className="card-body">
                        <h5 className="card-title">Mon panier</h5>
                        <p className="card-text">Nombres d'articles : {command.quantite} </p>
                        <p className="card-text">Mes articles : </p>
                        {command.produit.map((item,index)=>{
                            return (
                                <>
                                <div className="card-body d-flex align-items-baseline" key={item._id+index}>
                                    <p className="card-text">{item.designation}</p>
                                    <p className="card-text d-flex align-items-baseline "><button onClick={removeArticle(item)} className="btn bi bi-dash-square"></button>{item.quantite}<button onClick={addArticle(item)} className="btn bi bi-plus-square"></button></p>
                                </div>
                                </>
                            )
                        })}
                        <p className="card-text">sous-total ttc : {command.prix_ttc} euros </p>

                    </div>
                    </div>
                    </div>
                </>
               
            </div>
        
        </>
    )
}
export default Cart;