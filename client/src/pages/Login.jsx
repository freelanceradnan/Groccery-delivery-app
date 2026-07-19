import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import {
  useChangePasswordMutation,
  useEmailVerifyMutation,
  useLoginUserMutation,
  useOtpVerifyMutation,
  useRegisterUserMutation,
} from "../Feature/ApiSlice";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [registeruser, { isError, isLoading: registerLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isError: loginError, isLoading: loginLoading }] =
    useLoginUserMutation();
  const [EmailVerify, { isLoading: emailLoading }] = useEmailVerifyMutation();
  const [verifyOtp, { isLoading: otpLoading }] = useOtpVerifyMutation();
  const [changePassword,{isLoading:changePassLoading}]=useChangePasswordMutation()
  const [step, setStep] = useState("1");
  //otp fields
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  //register users data
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //register user handler change
  const changeRegisterHandler = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //submit register users
  const submitRegisterHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await registeruser(registerData).unwrap();
      localStorage.setItem("token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      setTimeout(() => {
        navigate("/");
      }, 1000);
      toast.success("Registration Success!");
    } catch (error) {
      toast.error("Registration Failed!", error);
    }
  };
  //login user data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  //login change Handler
  const changeLoginHandler = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //user login handler
  const submitLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData).unwrap();
      localStorage.setItem("token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      toast.success("User Login Success!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "user login failed!");
    }
  };

  //forgot password
  const [forgotEmail, setForgotEmail] = useState({
    email:""
  });
  //step-1 email verify
  const EmailVerifyHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await EmailVerify(forgotEmail);
      if (response?.data?.success) {
        toast.success(response.data.message || "Verification email sent!");
        setTimeout(() => {
          setStep("2");
        }, 1000);
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Please try again!",
        );
      }
    } catch (error) {
      toast.error(response?.data?.message || "failed to verify email");
    }
  };
  //otp verify
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };
  const submitOtp = async (e) => {
    e.preventDefault();
    try {
      const mainotp = otp.join("");
      const response = await verifyOtp({ email: forgotEmail.email, otp: mainotp });
      if (response?.data?.success) {
        toast.success(response.data.message || "Otp verify success!");
        setTimeout(() => {
          setStep("3");
        }, 1000);
      }
      else{
         toast.error(response.data.message || "Otp verify failed!");
      }
    } catch (error) {
       toast.error(response.data.message || "Otp verify failed!");
    }
  };
  //change password
  const [newPassword,setNewPassword]=useState("")
    const changePasswordhandler = async (e) => {
    e.preventDefault();
    try {
      const mainotp = otp.join("");
      const response = await changePassword({ email: forgotEmail.email, otp: mainotp,password:newPassword});
      if (response?.data?.success) {
        toast.success(response.data.message || "Password updated success!");
        setTimeout(() => {
         setStep('3')
         setState('login')
        }, 1000);
      }
      else{
         toast.error(response.data.message || "Otp verify failed!");
      }
    } catch (error) {
       toast.error(response.data.message || "Otp verify failed!");
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* left-side */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-emerald-950">
        <img
          src={assets.loginpng}
          alt=""
          className="absolute inset-0 object-cover w-full h-full bg-center opacity-40"
        />
        <div className="relative text-center px-12 z-10">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Welcome back to Supacart
          </h2>
          <p className="text-white/80 font-serif text-xl max-w-sm mx-auto">
            Fresh groceries and organic produce, delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* right-side */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAF8F5]">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex gap-2 items-center justify-center">
            <img
              src={assets.favicon}
              className="h-8 w-8 object-contain"
              alt="logo"
            />
            <div className="text-2xl font-bold text-emerald-950 tracking-tight">
              Supacart
            </div>
          </Link>

          {/* Header Heading Toggle */}
          <div className="text-center">
            {state === "login" && (
              <>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  Sign in to your account
                </div>
                <div className="flex gap-1.5 justify-center items-center">
                  <h2 className="text-sm text-gray-500">
                    Don't have an account?
                  </h2>
                  <button
                    className="text-sm text-orange-600 font-semibold hover:underline"
                    onClick={() => setState("signup")}
                  >
                    Create one
                  </button>
                </div>
              </>
            )}

            {state === "signup" && (
              <>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  Sign up for an account
                </div>
                <div className="flex gap-1.5 justify-center items-center">
                  <h2 className="text-sm text-gray-500">
                    Already have an account?
                  </h2>
                  <button
                    className="text-sm text-orange-600 font-semibold hover:underline"
                    onClick={() => setState("login")}
                  >
                    Login Account
                  </button>
                </div>
              </>
            )}
            {state === "forget" && step && (
              <>
                {/* Header Section */}
                <div className="text-2xl font-bold text-gray-900 mb-1 text-center">
                  Forgot Your Password?
                </div>

                <div className="flex gap-1.5 justify-center items-center mb-6 ">
                  <h2 className="text-sm text-gray-500">
                    Remember your password?
                  </h2>
                  <button
                    className="text-sm text-orange-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => setState("login")}
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Form Layout */}
          <div
            className="w-full flex flex-col gap-4"
            // onSubmit={
            //   loginstate === true ? submitLoginHandler : submitRegisterHandler
            // }
          >
            {state === "signup" && (
              <form onSubmit={submitRegisterHandler}>
                {/* Name Input */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      value={registerData.name}
                      onChange={changeRegisterHandler}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-gray-400 h-5 w-5" />
                    <input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={changeRegisterHandler}
                      placeholder="ad@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 text-gray-400 h-5 w-5" />
                    <input
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={changeRegisterHandler}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {registerLoading ? (
                  <button className="w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm">
                    Registering user
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm"
                  >
                    Register user
                  </button>
                )}
              </form>
            )}

            {state === "login" && (
              <>
                {/* Email Input */}
                <form
                  className="w-full flex flex-col gap-1.5"
                  onSubmit={submitLoginHandler}
                >
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-gray-400 h-5 w-5" />
                    <input
                      name="email"
                      value={setLoginData.email}
                      type="email"
                      onChange={changeLoginHandler}
                      placeholder="ad@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 text-gray-400 h-5 w-5" />
                      <input
                        value={setLoginData.password}
                        onChange={changeLoginHandler}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      />
                    </div>
                  </div>
                  {/* forgot password */}
                  <div className="w-full gap-1.5 flex justify-end">
                    <button
                      type="button"
                      className="text-[#032D1B] font-semibold"
                      onClick={() => setState("forget")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  {loginLoading ? (
                    <button className="w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm">
                      Signing user ...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm"
                    >
                      Sign In
                    </button>
                  )}
                </form>
              </>
            )}
            {state === "forget" && step === "1" && (
              <form className="space-y-4 w-full" onSubmit={EmailVerifyHandler}>
                <div className="w-full flex flex-col gap-5">
                  <label className="text-sm font-medium text-gray-700 text-left">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-gray-400 h-5 w-5" />

                    <input
                      name="email"
                      type="email"
                      value={forgotEmail.email || ""}
                      onChange={(e) =>
                        setForgotEmail({
                          ...forgotEmail,
                          email: e.target.value,
                        })
                      }
                      placeholder="ad@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {emailLoading ? (
                  <button
                    type="submit"
                    disabled
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Sending otp ...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Next
                  </button>
                )}
              </form>
            )}
            {state === "forget" && step === "2" && (
              <div className="w-full flex flex-col justify-center items-center">
                <form
                  action=""
                  className="max-w-sm shadow-md flex flex-col gap-4"
                  onSubmit={submitOtp}
                >
                  <h2 className="uppercase font-semibold text-[#002C22]">
                    Enter your otp
                  </h2>
                  <div
                    className="flex gap-2 justify-center items-center"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none font-semibold text-lg transition-colors"
                      />
                    ))}
                  </div>
                  {otpLoading?
                <button
                    type="submit"
                    disabled
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Verifying Otp ...
                  </button>:
                  <button
                    type="submit"
                    
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Process Next
                  </button>  
                }
                </form>
              </div>
            )}
            {state === "forget" && step === "3" && (
               <form className="space-y-4 w-full" onSubmit={changePasswordhandler}>
                <div className="w-full flex flex-col gap-5">
                  <label className="text-sm font-medium text-gray-700 text-left">
                    Enter Your New Password
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-gray-400 h-5 w-5" />

                    <input
                      name="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="*******"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {changePassLoading ? (
                  <button
                    type="submit"
                    disabled
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Changing Password...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                  >
                    Change Password
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
