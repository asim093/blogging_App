import React, { useContext, useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Navbar from '../../Components/Navbar/Navbar';
import { getAllData } from '../../../Config/Firebase/firebasemethod';
import AuthContext from '../../../Context/AuthContext';

const Allblog = () => {
  const [Alldata, Setdata] = useState([]);
  const { isLike, setIsLike } = useContext(AuthContext); 

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const blogsData = await getAllData('Blogs');
      const usersData = await getAllData('users');
      const usersMap = {};
  
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
  
      const blogsWithUserData = blogsData.map(blog => {
        const user = usersMap[blog.uid] || null;
        return {
          ...blog,
          user,
          id: blog.id || blog.uid 
        };
      });
  
      Setdata(blogsWithUserData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const toggleLike = (item) => {
    setIsLike(prev => {
      const isLiked = prev.some(likedItem => likedItem.id === item.id);
      console.log(`Item ID: ${item.id}, Is Liked: ${isLiked}`); 

      if (isLiked) {
        return prev.filter(likedItem => likedItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  useEffect(() => {
    console.log("Current isLike state:", isLike);
  }, [isLike]);

  return (
    <>
      <Navbar />
      <div className="w-full h-auto p-5">
        <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold ps-6">All Blog Posts</h1>
      </div>
      {
        Alldata.length > 0 ? (
          Alldata.map((item, index) => (
            <div key={index} className="card bg-white border-2 border-gray-200 rounded-lg shadow-md mb-4 w-[80%] mx-auto">
              <div className="card-body flex">
                <img
                  src={item.user?.profileImage || '/defaultProfile.png'}
                  alt={item.user?.name || 'Unknown User'}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h5 className="text-xl font-bold">{item.title}</h5>
                    <p className="text-gray-500">{`Posted by ${item.user?.name || 'Unknown User'}`}</p>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm text-right">{item.postedAt}</p>
                    <button onClick={() => toggleLike(item)} className="text-red-500">
                      {isLike.some(likedItem => likedItem.id === item.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className='text-center text-3xl'>Loading ...</h1>
        )
      }
    </>
  );
};

export default Allblog;
