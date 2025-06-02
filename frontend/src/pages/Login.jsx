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
      <div className="w-[100vw] h-[100vh] flex flex-col">
        <form
          className="flex flex-col gap-y-7 lg:gap-y-6 mt-[15%] lg:mt-[5%] justify-center items-center"
          onSubmit={formSubmit}
        >
          <h3 className=" text-[25px] font-bold">Be Positive</h3>

          <p className="text-[12px] tracking-widest font-medium">
            No Account ?{" "}
            <Link className="text-[blue] font-bold underline" to="/register">
              Sign up
            </Link>
          </p>
          <div>
            <input
              className="w-[80vw] lg:w-[30vw] bg-[#222222] h-[50px] text-center text-[#ffff] rounded-2xl"
              onChange={handleOnChange}
              name="email"
              type="text"
              placeholder="Email"
              value={formData.email}
              required
            />
          </div>
          <div className="ml-[9vw] lg:ml-[2vw]">
            <input
              className="w-[80vw] lg:w-[30vw] bg-[#222222] h-[50px] text-center text-[#ffff] rounded-2xl"
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
                  className="text-[#fff] relative top-2 right-12 w-[30px] h-[25px] bg-[brown]"
                />
              </button>
            ) : (
              <button type="button">
                {" "}
                <BsEmojiExpressionless
                  onClick={() => setShowPass(!showPass)}
                  className="text-[#fff] relative top-2 right-12 w-[30px] h-[25px] bg-[blue]"
                />
              </button>
            )}
          </div>

          <button
            className="w-[50vw] lg:w-[12vw] bg-[green] rounded-2xl h-[50px] font-bold text-[white] text-[20px]"
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
                style={{
                  width: "200px",
                  height: "160px",
                  background: "brown",
                }}
                loop
                autoplay
              ></lottie-player>
            </div>
            <p
              style={{ display: isLoading ? "none" : "block" }}
              className="test-[#fff] text-[20px]"
            >
              Login
            </p>
          </button>

          <p className="font-bold">/</p>
          <div className="w-[60vw] lg:w-[20vw] border-3">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
            </GoogleOAuthProvider>
          </div>
          <p className="text-[purple] font-extrabold">Powered By Shyhoon</p>
        </form>
      </div>
    </>
  );
}

export default Login;
