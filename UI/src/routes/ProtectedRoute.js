import {useContext} from 'react'
import { Navigate } from "react-router-dom";
import UserContext from "../utils/UserContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  if (user?.data?.id === undefined) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};