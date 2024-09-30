import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../../Components/Navbar/Navbar';
import { sendData, getData, deleteDocument, updateDocument } from '../../../Config/Firebase/firebasemethod';
import swal from 'sweetalert';
import { db } from '../../../Config/Firebase/firebasemethod';
import AuthContext from '../../../Context/AuthContext';

const Dashboard = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [Isdata, Setdata] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const { setIsAuthenticated } = useContext(AuthContext);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            uid: currentUser ? currentUser.uid : '',
            title: '',
            description: ''
        }
    });
    useEffect(() => {
        setIsAuthenticated(true);
    }, [])





    const fetchUserProfile = async (uid) => {
        try {
            const q = query(collection(db, "users"), where("id", "==", uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No user data found in Firestore for UID:", uid);
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setUserProfile({
                        name: data.name,
                        profileImage: data.profileImage
                    });
                });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const fetchData = async () => {
        if (currentUser) {
            try {
                const querySnapshot = await getDocs(query(collection(db, "Blogs"), where("uid", "==", currentUser.uid)));
                const formattedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                Setdata(formattedData);
                await fetchUserProfile(currentUser.uid);
            } catch (error) {
                console.error("Error fetching blog data:", error);
                swal("Error!", "There was an error fetching your blog posts.", "error");
            }
        }
    };


    // useEffect(() => {
    //     fetchData();
    // }, [currentUser]);

    const deletedata = async (docId) => {
        console.log(Isdata);
        try {
            const message = await deleteDocument(docId, "Blogs");
            console.log(message);
            swal("Deleted!", "Your blog post has been deleted.", "success");
            fetchData();
        } catch (error) {
            console.error("Error deleting data:", error);
            swal("Error!", "There was an error deleting your blog post.", "error");
        }
    };

    const updatedata = async (id) => {
        const updatedTitle = prompt("Enter Updated Title").trim();
        const updateddescription = prompt("Enter Updated description").trim();


        if(updatedTitle || updateddescription === "" ){
            alert("Title and Description cannot be empty.");
            return;
        }
        const updatedval = {
            title: updatedTitle,
            description: updateddescription,
        }
        try {
            const editdata = await updateDocument(updatedval, id, 'Blogs');
            console.log(editdata);
            swal("updated!", "Your blog post has been updated.", "success");
        } catch (error) {
            console.log(error)
            swal("Error!", "There was an error deleting your blog post", "error");


        }
    }
    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, updatedata]);

    const onSubmit = async (data) => {
        try {
            if (!data.title || !data.description) {
                swal("Error!", "Title and Description cannot be empty.", "error");
                return;
            }

            const currentTime = new Date().toLocaleString();
            data.postedAt = currentTime;

            await sendData(data, "Blogs");
            swal("Success!", "Your blog post has been submitted successfully.", "success");
            reset();
            fetchData();
        } catch (error) {
            console.error("Error sending data to Firebase:", error);
            swal("Error!", "There was an error submitting your blog post. Please try again.", "error");
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full h-auto p-5">
                <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold ps-6">Dashboard</h1>
            </div>

            <form
                className='flex justify-center items-center flex-col bg-[#f7f2f2] p-10 w-[80%] mx-auto mt-10'
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="text"
                    placeholder="Enter Your Blog Title"
                    className="input input-bordered w-full max-w-full mt-5"
                    {...register("title")}
                />
                <textarea
                    className="textarea textarea-bordered w-full max-w-full mt-5 h-[20%] min-h-[150px]"
                    placeholder="Enter Blog Description"
                    {...register("description")}
                />

                <button type="submit" className="btn bg-[#7749f8] text-white mt-5">Submit</button>
            </form>

            <div className="w-full h-auto p-5 mt-10">
                <h2 className="text-3xl font-bold ps-6">My Blogs</h2>
                <ul className="mt-5">
                    {Isdata.length > 0 ? (
                        Isdata.map((blog) => (
                            <div key={blog.id} className="card bg-white border-2 border-gray-200 rounded-lg shadow-md mb-4 w-[80%] mx-auto">
                                <div className="card-body flex">
                                    <img src={userProfile.profileImage} alt={userProfile.name} className="w-20 h-20 rounded-full mr-4" />
                                    <div className="flex flex-col justify-between w-full">
                                        <div>
                                            <h5 className="text-xl font-bold">{blog.title}</h5>
                                            <p className="text-gray-500">{`Posted by ${userProfile.name}`}</p>
                                            <p className="text-gray-700">{blog.description}</p>
                                        </div>
                                        <p className="text-gray-400 text-sm text-right">{blog.postedAt}</p>
                                    </div>
                                </div>
                                <div className="card-footer flex justify-end p-2">
                                    <button className="btn btn-primary mr-2" onClick={() => deletedata(blog.id)}>Delete</button>
                                    <button className="btn btn-primary" onClick={() => updatedata(blog.id)}>Edit</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-2xl'>No blog posts found.</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Dashboard;
