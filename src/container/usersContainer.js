import { connect } from 'react-redux';

// == Import : local
import Users from '../components/users';
// Action Creators
import { login,updateErrorMessage,signup , connect as connecting,env,ipProd} from '../store/reducer/appReducer';

/* === State (données) ===
 * - mapStateToProps retroune un objet de props pour le composant de présentation
 * - mapStateToProps met à dispo 2 params
 *  - state : le state du store (getState)
 *  - ownProps : les props passées au container
 * Pas de data à transmettre ? const mapStateToProps = null;
 */
const mapStateToProps = (state) => ({ 
  role:state.appReducer.role,
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
  signup: (data) => {
  dispatch(signup(data))
  },
  updateErrorMessage :(data)=>{
      dispatch(updateErrorMessage(data))
  },
  connect :(data)=>{
    dispatch(connecting(data))
  }

});

// Container
const UsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Users);

// == Export
export default UsersContainer;

/* = export à la volée
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example);
*/