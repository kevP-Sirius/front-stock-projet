import { Link } from "react-router-dom";

let Homepage =({isConnected,username,role})=>{
    console.log(`homepage connexion : ${isConnected}`)
    return(
        <div className="container">
            <div className="row">
                <div>
                   {!isConnected && <>
                   <p className="d-flex align-items-baseline">Bienvenue dans l'outil de gestion de stock veuillez vous<Link className="nav-link active"  to="/signin">connectez</Link> ou <Link className="nav-link active"  to="/signup">crée un compte</Link> .</p>
                   </>
                   }
                   {isConnected && <><p>Bienvenue dans l'outil de gestion, vous êtes connecté en tant que l'utilisateur : {username} , avec le role : {role} </p></>} 
                </div>
            </div>
        </div>
    )
}

export default Homepage;