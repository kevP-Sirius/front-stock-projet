import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as moment from 'moment';
import './cart.scss'
const qs = require('qs');

let Cart =({role,isConnected,connect})=>{
    let [products , SetProducts ] =useState([])
    let navigate = useNavigate();
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
        if(localStorage.getItem("user")!==null){
            const userInfo = JSON.parse(JSON.parse(localStorage.getItem("user")))
            console.log(userInfo) 
            connect(userInfo)
        }else{
            if(role!=="admin" && role!=="livreur"){
                navigate('/')
            }
        }
        
    },[role])
    return (
        <>
        <div className="d-flex justify-content-center mb-3"><p>numéro de commande : </p></div>
            <div className="container d-flex justify-content-around">
                <div className="col-8">
                    {products.map((product)=>{
                        return(
                                <div className="card cardStyle"  key={product._id}>
                                <div className="card-body">
                                <h5 className="card-title">{product.designation}</h5>
                                <p className="card-text">prix : {product.prix_vente} euros</p>
                                <p className="card-text">stock : {product.quantite_en_stock}</p>
                                <p className="card-text"><i class="bi bi-dash-square"></i> 0 <i class="bi bi-plus-square"></i></p>
                                </div>
                                </div>
                            )
                        }
                        )
                    }
                </div>
                <>  
                    <div className="col-2">
                    <div className="panierTab">
                    <div className="card-body">
                        <h5 className="card-title">Mon panier</h5>
                        <p className="card-text">Liste des articles</p>
                        <p className="card-text">sous-total ttc</p>

                        </div>
                    </div>
                    </div>
                </>
               
            </div>
        
        </>
    )
}
export default Cart;