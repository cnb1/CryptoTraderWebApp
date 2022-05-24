import React, {useContext} from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { AuthContext } from '../context/auth';

const AuthRoute = () => {
    const {user} = useContext(AuthContext);
    return user ? <Navigate to='/'/> : <Outlet/>;

}

export default AuthRoute;