import { useEffect } from "react";
import { Link } from "react-router-dom"
import "./navBar.scss"
let NavBar = ({isConnected,role, username,disconnect })=>{
    useEffect(()=>{
      
    },[username])
 return(
    < nav className="navbar navbar-expand-lg  navbar-light bg-light">
  <button className="moveButton navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className=" navbar-toggler-icon"></span>
  </button>
   
    <div className=" collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="moveList navbar-nav me-auto mb-2 ">
          {isConnected===false && 
        <>
             <li className="nav-item">
            <Link className="nav-link active"  to="/">accueil</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link active"  to="/signin">connexion</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link active"  to="/signup">inscription</Link>
            </li>
        </>}
        {isConnected  && role==="admin" && 
        <>
            <li className="nav-item">
                <Link className="nav-link active"  to="/operations">Listes des opérations</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active"  to="/products">Listes des produits</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active"  to="/clients">Listes des clients</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active"  to="/users">Listes des utilisateurs</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active"  to="/historiquestock">Historique</Link>
            </li>
        </>}
        {isConnected  && role==="comptable" && 
        <>
            <li className="nav-item">
                <Link className="nav-link active"  to="/operations">Listes des opérations</Link>
            </li>
        </>}
        {isConnected  && role==="livreur" && 
        <>
            <li className="nav-item">
                <Link className="nav-link active"  to="/operations">Effectuer des opérations</Link>
            </li>
        </>}
        {isConnected &&
        <>
            <li className="nav-item ">
               <p className="nav-link active" >Utilisateur : {username}({role}) </p> 
            </li>
            <li className="nav-item">
               <button onClick={()=>disconnect()}className="btn btn-danger"><span className="">Déconnexion</span></button> 
            </li>
        </>
        }
      </ul>
    </div>
</nav>
 )
}

export default NavBar;