import { createBrowserRouter } from "react-router-dom";
import Allblog from "../src/Pages/AllBlog/Allblog";
import Dashboard from "../src/Pages/Dashboard/Dashboard";
import Profile from "../src/Pages/Profile/Profile";
import Login from "../src/Pages/Login/Login";
import Signup from "../src/Pages/Signup/Signup";
import ProtectedRoutes from "../src/Components/ProtectedRoutes";
import Notfound from "../src/Pages/NotFound/Notfound";
import Bookmark from "../src/Pages/Bookmark/Bookkmark";

const routes = [
  { path: '', element: <Allblog /> }, 
  { path: '/Allblog', element: <Allblog /> }, 
  { path: '/Login', element: <Login /> },
  { path: '/Signup', element: <Signup /> },
  { path: '/Dashboard', element:  <ProtectedRoutes component={<Dashboard/>}/> },
  { path: '/Profile', element: <ProtectedRoutes component={<Profile/>}/> },
  { path: '/BookMark', element: <ProtectedRoutes component={<Bookmark/>}/> },
  { path: "*", element: <Notfound /> },

];

const AppRouter = createBrowserRouter(routes); 

export default AppRouter;
