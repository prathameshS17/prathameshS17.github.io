import { useState } from "react";
import "./AuthCard.css";

export default function AuthCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <div className="flip-card"> */}
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        {/* <div> */}
          {/* Front - Login */}
          <div className="flip-face bg-rose-100 shadow-lg rounded-lg p-8 w-10">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn-primary">Login</button>
            <p className="text-sm mt-4 text-center">
              Don't have an account?{" "}
              <button className="text-blue-500 underline" onClick={() => setFlipped(true)}>
                Sign up
              </button>
            </p>
          </div>

          {/* Back - Signup */}
          <div className="flip-face back bg-white shadow-lg rounded-lg p-8 w-80">
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <input type="text" placeholder="Name" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn-primary">Create Account</button>
            <p className="text-sm mt-4 text-center">
              Already have an account?{" "}
              <button className="text-blue-500 underline" onClick={() => setFlipped(false)}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    // </div>
  );
}
