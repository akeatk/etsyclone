import React from 'react';
import {connect} from 'react-redux';
import { Route,Switch,Redirect,withRouter } from 'react-router-dom';
import {AuthRoute, ProtectedRoute} from '../util/routes_utils';
import NavbarContainer from './navbar/navbar_container';
import GreyScreenContainer from './session/grey_screen_container';
import ShowUserContainer from './user/show_user_container';
import EditUserContainer from './user/edit_user_container';
import ShowItemContainer from './item/show_item_container';
import {hideDropdown} from '../actions/ui_actions';

const App = (props) => (
  <div onClick={props.dropdown ? props.hideDropdown : null}
      className={props.greyScreen==='none' ? '' : 'no-scroll'}>
    {/* <Route path="/" component={NavBarContainer} /> */}
    {/* <Route exact path="/" component={Home} /> */}
    <NavbarContainer/>
    <GreyScreenContainer/>
    <Switch>
      <Route exact path='/' render={()=><p>home page</p>}/>
      <Route path='/listing/:itemId' component={ShowItemContainer}/>
      <Route exact path='/people/:username' component={ShowUserContainer}/>
      <ProtectedRoute exact path='/your/profile' component={EditUserContainer}/>
      <Redirect to="/"/>
    </Switch>
    <div className='temp-body'>
    </div>
  </div>
);

const mapStateToProps = state=>({
  greyScreen:state.ui.greyScreen,
  dropdown:state.ui.dropdown
});
const MapDispatchToProps = dispatch=>({
  hideDropdown:()=>dispatch(hideDropdown())
});

export default withRouter(connect(mapStateToProps,MapDispatchToProps)(App));
