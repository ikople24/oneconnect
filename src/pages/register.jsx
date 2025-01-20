import React from 'react';

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primaryTitle">
      <div className="w-full max-w-md p-8 space-y-6 bg-primaryBg shadow-md rounded-lg">
        <div className="flex justify-center">
          <img
            src="/vite.svg"
            alt="Logo"
            className="w-16 h-16"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-primaryTitle">Register City</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-left font-medium text-primaryContent">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-left font-medium text-primaryContent">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-left font-medium text-primaryContent">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white  bg-primaryContent rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
