import React from "react";
import { useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { googleAuth } from "../apis/auth";
import { useState } from "react";
import { loginUser } from "../apis/auth";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from "react-toastify";
import { validUser } from "../apis/auth";
import { jwtDecode } from "jwt-decode";
const defaultData = {
  email: "",
  password: "",
};
function Login() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();
  const googleSuccess = async (res) => {
    if (res?.credential) {
      // console.log(res);
      setIsLoading(true);
      const response = await googleAuth({ tokenId: res.credential });
      setIsLoading(false);
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        toast.success("Succesfully Login!");
        pageRoute("/chats");
      }
    }
  };
  const googleFailure = (error) => {
    toast.error("Something went Wrong.Try Again!");
  };
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (formData.email.includes("@") && formData.password.length > 4) {
      setIsLoading(true);
      const { data } = await loginUser(formData);
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        toast.success("Succesfully Login!");
        setIsLoading(false);
        pageRoute("/chats");
      } else {
        setIsLoading(false);
        toast.error("Invalid Credentials!");
        setFormData({ ...formData, password: "" });
      }
    } else {
      setIsLoading(false);
      toast.warning("Provide valid Credentials!");
      setFormData(defaultData);
    }
  };
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/chats";
      }
    };
    isValid();
  }, []);
  return (
    <>
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-20 relative">
          {/* <img className='w-[100px] absolute -top-16 left-28' src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/78c4af118001599.608076cf95739.jpg" alt="" /> */}
          <div className="absolute -top-5 left-0">
            <h3 className=" text-[25px] font-bold">Login</h3>
            <p className="text-[12px] tracking-wider font-medium">
              No Account ?{" "}
              <Link className="text-[blue] underline" to="/register">
                Sign up
              </Link>
            </p>
          </div>
          {/* <h2 className='text-2xl text-[#fff] font-bold tracking-wide my-6 text-center'>Login to your Account</h2> */}
          <form
            className="flex flex-col gap-y-6 mt-[12%] mx-auto"
            onSubmit={formSubmit}
          >
            <div>
              <input
                className="w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff] rounded-2xl"
                onChange={handleOnChange}
                name="email"
                type="text"
                placeholder="Email"
                value={formData.email}
                required
              />
            </div>
            <div className="relative">
              <input
                className="w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff] rounded-2xl"
                onChange={handleOnChange}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                required
              />
              {!showPass ? (
                <button type="button">
                  <BsEmojiLaughing
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                  />
                </button>
              ) : (
                <button type="button">
                  {" "}
                  <BsEmojiExpressionless
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                  />
                </button>
              )}
            </div>

            <button
              className="w-[100%] bg-[green] rounded-2xl sm:w-[80%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative"
              type="submit"
            >
              <div
                style={{ display: isLoading ? "" : "none" }}
                className="absolute -top-[53px] left-[27%] sm:-top-[53px] sm:left-[56px]"
              >
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "200px", height: "160px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
              <p
                style={{ display: isLoading ? "none" : "block" }}
                className="test-[#fff]"
              >
                Login
              </p>
            </button>

            <p className="text-[#fff] text-center sm:-ml-20">/</p>
            <div className="w-[50%] mx-auto lg:mr-[33%] border-3">
              <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleFailure}
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
