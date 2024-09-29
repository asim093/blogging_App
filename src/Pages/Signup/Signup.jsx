import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import swal from 'sweetalert';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../../Config/Firebase/Config';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendData, uploadImage } from '../../../Config/Firebase/firebasemethod';

const Signup = () => {
    const [isIcon, Seticon] = useState(false); 
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const navigate = useNavigate();
    const auth = getAuth(app);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            Name: '',
            Email: '',
            Password: '',
            profileImage: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.Email, data.Password);

            const profileImageUrl = await uploadImage(data.profileImage[0], data.Email);

            const userdata = {
                id: userCredential.user.uid,
                name: data.Name,
                email: data.Email,
                profileImage: profileImageUrl
            }

            await sendData(userdata, "users");

            swal("User SignUp", "Signup Successful", "success");
            navigate('/Login');
        } catch (error) {
            swal("User Signup Failed", error.message, "error");
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Navbar />
            <div className="w-full h-auto p-5">
                <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold ps-6">Signup</h1>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-auto gap-5 items-center bg-[#f1f0f0] shadow-lg w-[90%] lg:w-[30%] rounded h-[30rem] justify-center mt-2 px-5"
            >
                <input type="text" {...register('Name')} placeholder="Name" className="input input-bordered w-full max-w-xs" required />
                <input type="email" {...register('Email')} placeholder="Email" className="input input-bordered w-full max-w-xs" required />
                <div className="relative w-full max-w-xs">
                    <input
                        type={passwordVisible ? 'password' : 'text'}
                        {...register('Password')}
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

                <input type="file" {...register('profileImage')} className="file-input file-input-bordered file-input-[#7749f8] w-full max-w-xs" />
                <button type="submit" className="btn bg-[#7749f8] text-white">Signup</button>
            </form>
        </>
    );
};

export default Signup;
