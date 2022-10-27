import React from 'react'
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

function Navigation() {
    return (
        <Routes>
            <Route path="/" exact element={<Signin/>} />
            {/* <RouteWrapper path="/profile" exact isPrivate component={UserProfilePage} />
            <RouteWrapper path="/signup" exact component={Registration} /> */}
            <Route path="login" exact element={<Signin/>} />
            <Route path="logout" exact isPrivate element={<Logout/>} />
            <Route path="farms" exact isPrivate element={<FarmList/>} />
            <Route path="dashboard" exact isPrivate element={<Dashboard/>} />
            {/* <RouteWrapper path="/resetpassword" exact component={ResetPassword} />
            <RouteWrapper path="/user-dashboard" exact isPrivate component={UserDashboard} />
            <RouteWrapper path="/create-farm" exact isPrivate component={CreateFarm} />
            <RouteWrapper path="/load-farm" exact isPrivate component={Farm} />
            <RouteWrapper path="/load-project" exact isPrivate component={ProjectPage} />
            <RouteWrapper path="/load-projectlist" exact isPrivate component={ProjectList} />
            <RouteWrapper path="/discussion-board" exact isPrivate component={DiscussionBoardPage} />
            <RouteWrapper path="/todo" exact isPrivate component={TodoPage} /> */}
            <Route path="workflow" exact isPrivate element={<Workflow/>} />
            <Route path="workflow-list" exact isPrivate element={<WorkflowList/>} />
            <Route element={<Signin/>}/>
        </Routes>
        
    )
}

export default Navigation

