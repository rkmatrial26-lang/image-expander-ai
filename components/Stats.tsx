import React from 'react';

const Stats: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
          <h3 className="text-4xl font-bold text-white mb-2">1.6M+</h3>
          <p className="text-gray-300">Active Users</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
          <h3 className="text-4xl font-bold text-white mb-2">5000+</h3>
          <p className="text-gray-300">Images Expanded Daily</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
          <h3 className="text-4xl font-bold text-white mb-2">99%</h3>
          <p className="text-gray-300">User Satisfaction</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
          <h3 className="text-4xl font-bold text-white mb-2">10M+</h3>
          <p className="text-gray-300">Total Images Generated</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
