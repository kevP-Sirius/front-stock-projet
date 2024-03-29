import { connect } from 'react-redux';

// == Import : local
import FormCart from '../components/formCart';
// Action Creators
import { login,updateErrorMessage,connect as connecting } from '../store/reducer/appReducer';

/* === State (données) ===
 * - mapStateToProps retroune un objet de props pour le composant de présentation
 * - mapStateToProps met à dispo 2 params
 *  - state : le state du store (getState)
 *  - ownProps : les props passées au container
 * Pas de data à transmettre ? const mapStateToProps = null;
 */
const mapStateToProps = (state) => ({
    role:state.appReducer.role,
    isConnected:state.appReducer.isConnected,
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
  login: (data) => {
    dispatch(login(data))
  },
  updateErrorMessage :(data)=>{
      dispatch(updateErrorMessage(data))
  },
  connect :(data)=>{
    dispatch(connecting(data))
  }
});

// Container
const FormCartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormCart);

// == Export
export default FormCartContainer;

/* = export à la volée
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example);
*/