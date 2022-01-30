import { useEffect } from "react";
import { Link } from "react-router-dom"
let NavBar = ({isConnected,role, username,disconnect })=>{
    useEffect(()=>{
        console.log(username)
    },[username])
 return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
   
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
  </div>
</nav>
 )
}

export default NavBar;