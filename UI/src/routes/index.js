import React, {useContext} from 'react'
import { Routes, Route } from "react-router-dom";
// import Registration from '../pages/Registration'
import Signin from '../pages/Signin'
import Logout from '../pages/Logout'
// import ResetPassword from '../components/ResetPassword'
// import Home from '../pages/Home'
// import RouteWrapper from './RouteWrapper';
// import UserDashboard from '../pages/UserDashboard';
// import UserProfilePage from '../pages/UserProfilePage'
// import CreateFarm from '../pages/CreateFarm'
// import Farm from '../pages/Farm'
// import ProjectPage from '../pages/ProjectPage'
// import ProjectList from '../pages/ProjectList'
// import DiscussionBoardPage from '../pages/DiscussionBoardPage';
// import TodoPage from '../pages/TodoPage'
import Workflow from '../tools/Workflow';
import FarmList from '../components/farm/FarmList';
import Dashboard from '../pages/Dashboard';
import WorkflowList from '../components/workflow/WorkflowList';
import { ProtectedRoute } from './ProtectedRoute';
import UserContext from "../utils/UserContext";
import UserProfile from '../pages/UserProfile';
import UserActivities from '../pages/UserActivities';
import Home from '../pages/Home';
import Registration from '../pages/Registration';
import Members from '../pages/Members';
import Farm from '../pages/Farm';
import Transitions from '../components/notifications/Transitions';

function Navigation() {
    const { user } = useContext(UserContext);
    return (
        <Routes>
            <Route path="/" exact element={ user?.data?.id === undefined? <Home/> : <Dashboard/>} />
            {/* <RouteWrapper path="/profile" exact isPrivate component={UserProfilePage} />
            <RouteWrapper path="/signup" exact component={Registration} /> */}
            <Route path="login" exact element={<Signin/>} />
            <Route path="signup" exact element={<Registration/>} />
            <Route path="logout" exact isPrivate element={<ProtectedRoute><Logout/></ProtectedRoute>} />
            <Route path="farms" exact isPrivate element={<ProtectedRoute><FarmList/></ProtectedRoute>} />
            <Route path="dashboard" exact isPrivate element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
            <Route path="profile" exact isPrivate element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
            <Route path="members" exact isPrivate element={<ProtectedRoute><Members/></ProtectedRoute>} />
            <Route path="farm" exact isPrivate element={<ProtectedRoute><Farm/></ProtectedRoute>} />

            {/* <RouteWrapper path="/resetpassword" exact component={ResetPassword} />
            <RouteWrapper path="/user-dashboard" exact isPrivate component={UserDashboard} />
            <RouteWrapper path="/create-farm" exact isPrivate component={CreateFarm} />
            <RouteWrapper path="/load-farm" exact isPrivate component={Farm} />
            <RouteWrapper path="/load-project" exact isPrivate component={ProjectPage} />
            <RouteWrapper path="/load-projectlist" exact isPrivate component={ProjectList} />
            <RouteWrapper path="/discussion-board" exact isPrivate component={DiscussionBoardPage} />
            <RouteWrapper path="/todo" exact isPrivate component={TodoPage} /> */}
            <Route path="workflow" exact isPrivate element={<ProtectedRoute><Workflow/></ProtectedRoute>} />
            <Route path="transitions" exact isPrivate element={<ProtectedRoute><Transitions/></ProtectedRoute>} />
            {/* <Route path="workflow-list" exact isPrivate element={<ProtectedRoute><WorkflowList/></ProtectedRoute>} /> */}
            <Route path="user-workflow-list" exact isPrivate element={<ProtectedRoute><UserActivities/></ProtectedRoute>} />
            <Route element={<Signin/>}/>
        </Routes>
        
    )
}

export default Navigation

