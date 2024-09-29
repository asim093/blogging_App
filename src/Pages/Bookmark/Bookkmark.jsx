import React, { useContext, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import AuthContext from '../../../Context/AuthContext';

const Bookmark = () => {
    const { isLike, setIsLike } = useContext(AuthContext);

    const toggleLike = (itemId) => {
        // Remove the item with the specified ID from the isLike array
        setIsLike(prev => prev.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // You can add any side effects here if needed when isLike changes
    }, [isLike]);

    return (
        <>
            <Navbar />
            <div className="w-full h-auto p-5">
                <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold ps-6">Bookmarked Posts</h1>
            </div>
            <div className="w-[80%] mx-auto">
                {
                    isLike.length > 0 ? (
                        isLike.map((item, index) => (
                            <div key={index} className="card bg-white border-2 border-gray-200 rounded-lg shadow-md mb-4">
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
                                        <div className="flex justify-between items-center gap-10">
                                            <p className="text-gray-400 text-sm text-right">{item.postedAt}</p>

                                            <button className='btn' onClick={() => toggleLike(item.id)}>Remove Bookmark</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1 className='text-center text-3xl'>No Bookmarked Posts Found</h1>
                    )
                }
            </div>
        </>
    );
}

export default Bookmark;
