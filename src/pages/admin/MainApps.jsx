import Mainmap from '@/components/map/Mainmap';
import React, { useState, useEffect } from 'react';


const MainApps = () => {
  const [data, setData] = useState({
    officers: 0,
    communityLeaders: 0,
    citizens: 0,
  });



  useEffect(() => {
    // Fetch data from API or other sources
    // This is just an example, replace with actual data fetching logic
    setData({
      officers: 10,
      communityLeaders: 5,
      citizens: 100,
    });
  }, []);



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">จำนวนเจ้าหน้าที่</h2>
              <p className="text-2xl">{data.officers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">จำนวนผู้นำชุมชน</h2>
              <p className="text-2xl">{data.communityLeaders}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">จำนวนประชาชน</h2>
              <p className="text-2xl">{data.citizens}</p>
            </div>
        </div>
        <Mainmap />


    </div>
  );
};

export default MainApps;