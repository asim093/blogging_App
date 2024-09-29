import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; 

const ProtectedRoutes = ({ component }) => {
    const [isUser, setUser] = useState(null); 
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(true);
            } else {
                setUser(false); 
                navigate('/Login'); 
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    if (isUser === null) {
        return <h1>Loading...</h1>;
    }

    return isUser ? component : null; 
};

export default ProtectedRoutes;
