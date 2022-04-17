import { connect } from 'react-redux';

// == Import : local
import Signin from '../components/signin';
// Action Creators
import { login,updateErrorMessage } from '../store/reducer/appReducer';

/* === State (données) ===
 * - mapStateToProps retroune un objet de props pour le composant de présentation
 * - mapStateToProps met à dispo 2 params
 *  - state : le state du store (getState)
 *  - ownProps : les props passées au container
 * Pas de data à transmettre ? const mapStateToProps = null;
 */
const mapStateToProps = (state) => ({ 
    messageError:state.appReducer.messageError,
    username: state.appReducer.username,
    messageStatus:state.appReducer.messageStatus,
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
  }
});

// Container
const SigninContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signin);

// == Export
export default SigninContainer;

/* = export à la volée
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example);
*/