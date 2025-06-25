import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);

  const {
    setShowRecruiterLogin,
    backendUrl,
    setCompanyToken,
    setCompanyData,
  } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === 'Sign Up' && !isTextDataSubmited) {
      return setIsTextDataSubmited(true);
    }

    try {
      if (state === 'Login') {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem('companyToken', data.token);
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        if (!image) {
          return toast.error("Please upload company logo");
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);

        const { data } = await axios.post(`${backendUrl}/api/company/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem('companyToken', data.token);
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-[90%] max-w-md"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm text-center mb-5">
          Welcome back! Please {state === 'Login' ? 'Sign In' : 'Sign Up'} to continue
        </p>

        {state === 'Sign Up' && isTextDataSubmited ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image" className="cursor-pointer flex items-center gap-3">
              <img
                className="w-16 h-16 rounded-full object-cover border"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload Logo"
              />
              <div>
                <p className="font-semibold text-neutral-700">Upload Company Logo</p>
                <p className="text-xs text-gray-400">(Click image to upload)</p>
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          </div>
        ) : (
          <>
            {state !== 'Login' && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === 'Login' && (
          <p className="text-sm text-blue-600 mt-5 cursor-pointer">Forgot password?</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-5 hover:bg-blue-700 transition"
        >
          {state === 'Login' ? 'Login' : isTextDataSubmited ? 'Create Account' : 'Next'}
        </button>

        <p className="mt-5 text-center">
          {state === 'Login' ? (
            <>
              Don't have an account?{' '}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState('Sign Up');
                  setIsTextDataSubmited(false);
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setState('Login');
                  setIsTextDataSubmited(false);
                }}
              >
                Login
              </span>
            </>
          )}
        </p>

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer w-5"
          src={assets.cross_icon}
          alt="Close"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
