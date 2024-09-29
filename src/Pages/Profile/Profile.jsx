import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { db, updateDocument } from '../../../Config/Firebase/firebasemethod';
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';

const Profile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [postedBlogsCount, setPostedBlogsCount] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const uid = user.uid;
                try {
                    const q = query(collection(db, "users"), where("id", "==", uid));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            setUserData(doc.data());
                            setFormData({
                                name: doc.data().name || '',
                                email: doc.data().email || '',
                                password: '', 
                            });
                            setImagePreview(doc.data().profileImage || ''); 
                        });
                    }

                    const blogsQ = query(collection(db, "Blogs"), where("uid", "==", uid));
                    const blogsSnapshot = await getDocs(blogsQ);
                    setPostedBlogsCount(blogsSnapshot.size);

                    const userBlogs = [];
                    blogsSnapshot.forEach((doc) => {
                        userBlogs.push(doc.data());
                    });
                    setBlogs(userBlogs);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("User not authenticated!");
            return;
        }

        try {
            const obj = {
                name: formData.name,
                email: formData.email,
            };

            await updateDocument(obj, user.uid, "users");

            if (formData.email !== user.email) {
                await updateEmail(user, formData.email);
                await user.sendEmailVerification();
                alert('Verification email sent. Please verify your new email address.');
            }

            if (formData.password) {
                await updatePassword(user, formData.password);
            }

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error.message);
            alert('Failed to update profile. ' + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full h-auto p-5 bg-gray-100">
                <h1 className="text-4xl font-bold mb-5 text-center">Profile</h1>
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-5">
                        <div className="flex items-center mb-4">
                            <img
                                src={imagePreview || userData?.profileImage || 'https://tse2.mm.bing.net/th?id=OIP.dbdjMXeXeids14Gw4FIKkgHaEK&pid=Api&P=0&h=220'}
                                alt="User Avatar" 
                                className="w-16 h-16 rounded-full border-2 border-blue-500"
                            />
                            <div className="ml-4">
                                <h2 className="text-2xl font-semibold">{userData?.name || 'User Name'}</h2>
                                <p className="text-gray-600">{userData?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold">Posted Blogs: <span className="text-blue-600">{postedBlogsCount}</span></h3>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold">Bio:</h3>
                            <p className="text-gray-600">{userData?.bio || 'This is a short bio about the user.'}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold">Your Blogs:</h3>
                            <ul className="list-disc list-inside pl-5">
                                {blogs.length > 0 ? blogs.map((blog, index) => (
                                    <li key={index} className="text-gray-600">{blog.title}</li>
                                )) : (
                                    <li className="text-gray-600">No blogs posted yet.</li>
                                )}
                            </ul>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button onClick={handleEdit} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">Edit Profile</button>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-5 max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">Name:</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="border rounded w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="border rounded w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Password:</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className="border rounded w-full p-2"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
