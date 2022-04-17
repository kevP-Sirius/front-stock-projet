import { connect } from 'react-redux';

// == Import : local
import NavBar from '../components/navBar';
// Action Creators
import { firstAction,disconnect } from '../store/reducer/appReducer';

/* === State (données) ===
 * - mapStateToProps retroune un objet de props pour le composant de présentation
 * - mapStateToProps met à dispo 2 params
 *  - state : le state du store (getState)
 *  - ownProps : les props passées au container
 * Pas de data à transmettre ? const mapStateToProps = null;
 */
const mapStateToProps = (state) => ({ 
  isConnected: state.appReducer.isConnected,
  role: state.appReducer.role,
  username: state.appReducer.username,
  env:state.appReducer.env,
  ipProd:state.appReducer.ipProd,

});

/* === Actions ===
 * - mapDispatchToProps retroune un objet de props pour le composant de présentation
 * - mapDispatchToProps met à dispo 2 params
 *  - dispatch : la fonction du store pour dispatcher une action
 *  - ownProps : les props passées au container
 * Pas de disptach à transmettre ? const mapDispatchToProps = {};
 */
const mapDispatchToProps = (dispatch) => ({
    disconnect: () => {
      localStorage.clear()
    dispatch(disconnect())
  }, 
});

// Container
const NavBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);

// == Export
export default NavBarContainer;

/* = export à la volée
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example);
*/