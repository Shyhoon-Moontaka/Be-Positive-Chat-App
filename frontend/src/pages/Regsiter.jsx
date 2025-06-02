import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { googleAuth, registerUser } from "../apis/auth";
import { useState } from "react";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from "react-toastify";
import { validUser } from "../apis/auth";
const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};
function Regsiter() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.email.includes("@") && formData.password.length > 6) {
      const { data } = await registerUser(formData);
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        toast.success("Succesfully Registered😍");
        setIsLoading(false);
        pageRoute("/chats");
      } else {
        setIsLoading(false);
        toast.error("Invalid Credentials!");
      }
    } else {
      setIsLoading(false);
      toast.warning("Provide valid Credentials!");
      setFormData({ ...formData, password: "" });
    }
  };

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

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/chats";
      }
    };
    isValid();
  }, []);
  return (
    <div className="w-[100vw]">
      <form
        className="flex flex-col gap-y-3 mt-[10%] lg:mt-[2%] justify-center items-center"
        onSubmit={handleOnSubmit}
      >
        <h3 className=" text-[25px] font-bold tracking-wider">Be Positive</h3>
        <p className="text-[12px] tracking-wider font-medium">
          Have Account ?{" "}
          <Link className="text-[green] font-bold underline" to="/">
            Sign in
          </Link>
        </p>
        <div className="flex flex-row justify-center items-center gap-x-2">
          <input
            onChange={handleOnChange}
            className="bg-[#222222] h-[50px] text-center text-[#ffff] w-[44.5vw] lg:w-[20vw] rounded-2xl"
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            required
          />
          <input
            onChange={handleOnChange}
            className="bg-[#222222] h-[50px] text-center text-[#ffff] w-[44.5vw] lg:w-[20vw] rounded-2xl"
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            required
          />
        </div>
        <div>
          <input
            onChange={handleOnChange}
            className="bg-[#222222] h-[50px] text-center text-[#ffff] w-[90vw] lg:w-[40.5vw] rounded-2xl"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            required
          />
        </div>
        <div className="relative flex flex-col gap-y-3">
          <input
            onChange={handleOnChange}
            className="bg-[#222222] h-[50px] text-center text-[#ffff] w-[90vw] lg:w-[40.5vw] rounded-2xl"
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            required
          />
          <div>
            <input
              onChange={handleOnChange}
              className="bg-[#222222] h-[50px] text-center text-[#ffff] w-[90vw] lg:w-[40.5vw] rounded-2xl"
              type="url"
              name="profilePic"
              placeholder="Profile Picture Url"
              value={formData.profilePic}
              required
            />
          </div>

          {!showPass ? (
            <button type="button">
              <BsEmojiLaughing
                onClick={() => setShowPass(!showPass)}
                className="text-[#fff] absolute top-3 right-4 w-[30px] h-[25px]"
              />
            </button>
          ) : (
            <button type="button">
              {" "}
              <BsEmojiExpressionless
                onClick={() => setShowPass(!showPass)}
                className="text-[#fff] absolute top-3 right-4 w-[30px] h-[25px]"
              />
            </button>
          )}
        </div>
        <button
          className="w-[60vw] lg:w-[20vw] bg-[blue] rounded-2xl h-[50px] font-bold text-[white] text-[17px]"
          type="submit"
        >
          <div
            style={{ display: isLoading ? "" : "none" }}
            className="absolute -top-[53px] left-[29.5%] sm:-top-[53px] sm:left-[87px]"
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
            Regsiter
          </p>
        </button>
        <p className="font-bold">/</p>
        <div className="w-[70vw] lg:w-[25vw] border-3">
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          >
            <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
          </GoogleOAuthProvider>
        </div>
        <p className="text-[purple] font-extrabold">Powered By Shyhoon</p>
      </form>
    </div>
  );
}

export default Regsiter;
