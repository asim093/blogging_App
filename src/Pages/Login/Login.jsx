import React, { useContext, useState } from 'react';
import swal from 'sweetalert';
import Navbar from '../../Components/Navbar/Navbar';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from '../../../Context/AuthContext.jsx';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      Email: '',
      password: ''
    }
  });

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onsubmit = (data) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, data.Email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsAuthenticated(true);
        swal("User Login", "Successfull", "success");
        navigate('/Dashboard');

      })
      .catch((error) => {
        swal("User Login Failed", `${error.message}`, "error");
      });
  };

  return (
    <>
    <Navbar/>
      <div className="w-full h-auto p-5">
        <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold ps-6">Login</h1>
      </div>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col mx-auto gap-5 items-center shadow-lg bg-[#f1f0f0] w-[90%] lg:w-[30%] rounded h-[30rem] justify-center mt-2 px-5">
        <input type="email" {...register('Email')} placeholder="Email" className="input input-bordered w-full max-w-xs" required />

        <div className="relative w-full max-w-xs">
          <input
            type={passwordVisible ? 'text' : 'password'}
            {...register('password')}
            placeholder="Password"
            className="input input-bordered w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" className="btn bg-[#7749f8] text-white">Login</button>
      </form>
    </>
  );
};

export default Login;
