import React from "react";
import Logo from "./assets/Foothouse-Logo.png";

function App() {
  const handleGoogleLogin = () => {
    window.location.href = "http://103.147.92.133:5000/auth/google";
  };

  return (
    <div className="flex min-h-screen bg-navy-50 items-center justify-center">
      {/* Main Content */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Foothouse Logo" className="w-20 h-auto" />
        </div>

        <h1 className="text-4xl font-bold text-navy-900 mb-4 text-center">
          Foothouse
        </h1>
        <h2 className="text-lg font-medium text-gray-600 mb-6 text-center">
          Footwear Management System
        </h2>

        <div className="text-center">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
