import { Link } from "react-router-dom";
import './homepage.scss'
let Homepage =({isConnected,username,role})=>{
    console.log(`homepage connexion : ${isConnected}`)
    return(
        <div className="container background-homepage">
            <div className="row">
                <div className="d-flex">
                   {!isConnected && <>
                   <p className="d-sm-flex d-block align-items-baseline ">Bienvenue dans l'outil de gestion de stock veuillez vous<Link className="nav-link active"  to="/signin">connectez</Link> ou <Link className="nav-link active"  to="/signup">crée un compte</Link> .</p>
                   </>
                   }
                   {isConnected && <><p className="text-light bg-dark">Bienvenue dans l'outil de gestion, vous êtes connecté en tant que l'utilisateur : {username} , avec le role : {role} </p></>} 
                </div>
            </div>
        </div>
    )
}

export default Homepage;