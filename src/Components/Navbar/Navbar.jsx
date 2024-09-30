import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../../Config/Firebase/firebasemethod';
import { collection, getDocs, query, where } from "firebase/firestore";
import swal from 'sweetalert';
import AuthContext from '../../../Context/AuthContext.jsx';

const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated, Setdarkmode, darkmode, typography, setTypography } = useContext(AuthContext); // Added darkmode here
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState('https://tse2.mm.bing.net/th?id=OIP.dbdjMXeXeids14Gw4FIKkgHaEK&pid=Api&P=0&h=220'); // Default image
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [typographyDropdownOpen, setTypographyDropdownOpen] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const uid = currentUser.uid;

                try {
                    const q = query(collection(db, "users"), where("id", "==", uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.profileImage) {
                                setProfileImage(data.profileImage);
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching profile image:", error);
                }
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                swal("User Logout", "Successful", "success");
                setIsAuthenticated(false);
                navigate("/Login");
            })
            .catch((error) => {
                swal("User Logout Failed", `${error.message}`, "error");
            });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleTypographyDropdown = () => {
        setTypographyDropdownOpen(!typographyDropdownOpen);
    };

    const handleTypographyChange = (fontClass) => {
        setTypography(fontClass);
        document.documentElement.className = fontClass;
    };

    const toggleDarkMode = () => {
        Setdarkmode(!darkmode);
        document.documentElement.setAttribute('data-theme', darkmode ? 'light' : 'dark');
    };

    return (
        <div className="navbar bg-[#6b41df] text-neutral-content px-4 md:px-12 flex flex-wrap">
            <h1 className="font-bold text-white text-lg md:text-2xl">Personal Blogging App</h1>

            <div className="ml-auto flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="relative">
                            <div className="avatar online cursor-pointer" onClick={toggleDropdown}>
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white hover:border-blue-500 transition duration-300">
                                    <img
                                        src={profileImage}
                                        alt="User Avatar"
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                            {dropdownOpen && (
                                <ul className="absolute right-0 mt-2 w-36 md:w-48 bg-white rounded-lg shadow-lg p-4 z-10">
                                    <li className="py-2 hover:bg-blue-100 rounded-md transition duration-300">
                                        <Link to="/Allblog" className="text-gray-700 font-semibold block">All Blog</Link>
                                    </li>
                                    <li className="py-2 hover:bg-blue-100 rounded-md transition duration-300">
                                        <Link to="/Profile" className="text-gray-700 font-semibold block">Profile</Link>
                                    </li>
                                    <li className="py-2 hover:bg-blue-100 rounded-md transition duration-300">
                                        <Link to="/BookMark" className="text-gray-700 font-semibold block">Book Mark</Link>
                                    </li>
                                    <li className="py-2 hover:bg-blue-100 rounded-md transition duration-300">
                                        <Link to="/Dashboard" className="text-gray-700 font-semibold block">Dashboard</Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                        <Link
                            className="bg-blue-600 text-white text-sm px-2 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                            onClick={handleLogout}
                        >
                            Logout
                        </Link>
                    </div>
                ) : pathname === '/Signup' ? (
                    <Link className="btn" to="/Login">Login</Link>
                ) : pathname === '/Login' ? (
                    <Link className="btn" to="/Signup">Signup</Link>
                ) : (
                    <Link className="btn" to="/Login">Login</Link>
                )}

                <div className="relative ml-4 md:ml-6">
                    <button onClick={toggleTypographyDropdown} className="btn btn-sm">
                        Change Typography
                    </button>
                    {typographyDropdownOpen && (
                        <ul className="absolute right-0 mt-2 w-36 md:w-48 bg-white rounded-lg shadow-lg p-4 z-10">
                            <li onClick={() => handleTypographyChange('font-sans')} className="py-2 text-accent-content hover:bg-blue-100 cursor-pointer">Sans</li>
                            <li onClick={() => handleTypographyChange('font-serif')} className="py-2 hover:bg-blue-100 text-accent-content cursor-pointer">Serif</li>
                            <li onClick={() => handleTypographyChange('font-mono')} className="py-2 hover:bg-blue-100 text-accent-content cursor-pointer">Monospace</li>
                            <li onClick={() => handleTypographyChange('font-cursive')} className="py-2 hover:bg-blue-100 text-accent-content cursor-pointer">Cursive</li>
                        </ul>
                    )}
                </div>

                <label className="swap swap-rotate ml-4 md:ml-6">
                    <input
                        type="checkbox"
                        checked={darkmode}
                        onChange={toggleDarkMode}
                    />
                    {/* sun icon */}
                    <svg
                        className="swap-off h-6 w-6 md:h-10 md:w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    {/* moon icon */}
                    <svg
                        className="swap-on h-6 w-6 md:h-10 md:w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
            </div>
        </div>

    )
};

export default Navbar;
