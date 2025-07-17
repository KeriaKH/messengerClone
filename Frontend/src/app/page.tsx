"use client";

import { useAuth } from "@/components/AuthContext";
import { signup } from "@/services/authService";
import { LoginData } from "@/types/customeType/loginData";
import { signUpData } from "@/types/customeType/signUpData";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function LogSignPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [signUpData, setsignUpData] = useState<signUpData>({
    name: "",
    email: "",
    password: "",
  });
  const {isAuth,Login}=useAuth()

  const handleLogin = async () => {
    const isFilled = Object.values(loginData).every(
      (item) => item && item.trim() !== ""
    );
    if (!isFilled) {
      alert("nhập đủ thông tin");
      return;
    }
    const res = await Login(loginData)
    if ("token" in res) router.push("/home");
    else alert(res.message);
  };

  const handleSignUp = async () => {
    const isFilled = Object.values(signUpData).every(
      (item) => item && item.trim() !== ""
    );
    if (!isFilled) {
      alert("nhập đủ thông tin");
      return;
    }
    const res = await signup(signUpData);
    if (res._id) {
      alert("đăng ký thành công");
      setsignUpData({
        name: "",
        email: "",
        password: "",
      });
      setIsLogin(true);
      return;
    }
    alert(res.message);
  };

  useEffect(()=>{
    if(isAuth)
      router.push('/home')
  },[isAuth,router])

  return (
    <div className="w-full h-full" style={{ background: "var(--gradient-bg)" }}>
      <div className="w-[60%] h-screen mx-auto flex items-center ">
        <div className="shadow-2xl w-full bg-white border-2 border-white h-[60%] rounded-2xl relative">
          <div
            className={`absolute text-black top-0 left-0 w-1/2 h-full p-10 py-20 z-20 flex flex-col items-center justify-center space-y-10 ${
              isLogin ? "" : "opacity-0 transform translate-x-full"
            } transition duration-700 ease-in-out`}
          >
            <h2 className="font-bold text-4xl ">ĐĂNG NHẬP</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full bg-gray-300 p-3 rounded-2xl text-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Mật khẩu"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full bg-gray-300 p-3 rounded-2xl text-lg focus:outline-none"
              />
            </div>
            <button
              className="bg-blue-500 transition hover:bg-blue-700 p-2 w-[50%] text-white text-lg font-medium rounded-2xl"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          </div>
          <div
            className={`absolute text-black top-0 left-0 w-1/2 h-full p-10 py-20 z-10 flex flex-col items-center justify-center space-y-10 ${
              isLogin
                ? "opacity-0 "
                : "z-50 transform translate-x-full opacity-100"
            } transition duration-700 ease-in-out`}
          >
            <h2 className="font-bold text-4xl text-black">ĐĂNG KÝ</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên đầy đủ"
                value={signUpData.name}
                onChange={(e) =>
                  setsignUpData({ ...signUpData, name: e.target.value })
                }
                className="w-full bg-gray-300 p-3 rounded-2xl text-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) =>
                  setsignUpData({ ...signUpData, email: e.target.value })
                }
                className="w-full bg-gray-300 p-3 rounded-2xl text-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Mật khẩu"
                value={signUpData.password}
                onChange={(e) =>
                  setsignUpData({ ...signUpData, password: e.target.value })
                }
                className="w-full bg-gray-300 p-3 rounded-2xl text-lg focus:outline-none"
              />
            </div>
            <button
              className="bg-blue-500 transition hover:bg-blue-700 p-2 w-[50%] text-white text-lg font-medium rounded-2xl"
              onClick={handleSignUp}
            >
              Đăng ký
            </button>
          </div>
          <div
            className={`absolute w-1/2 h-full top-0 left-1/2 z-[100] transition duration-700 ease-in-out overflow-hidden ${
              isLogin ? "" : "transform -translate-x-full"
            }`}
          >
            <div
              className={`relative w-[200%] rounded-2xl -left-full h-full bg-gradient-to-br  from-pink-500 via-blue-500 to-purple-500 trasition transition duration-700 ease-in-out ${
                isLogin ? "" : "transform translate-x-1/2"
              }`}
            >
              <div
                className={`absolute top-0 w-1/2 h-full flex flex-col items-center justify-center transition duration-700 text-center px-10 text-white space-y-3 ${
                  isLogin ? "transform -translate-x-1/5" : ""
                }`}
              >
                <p className="text-3xl font-bold drop-shadow-xl">
                  Tạo tài khoản và bắt đầu 💬
                </p>
                <p className="italic text-gray-200">
                  Nếu bạn đã có tài khoản, hãy chọn nút đăng nhập
                </p>
                <button
                  className="p-2 text-lg bg-white/20 border-2 border-white w-[30%] transition hover:bg-white/0 hover:-translate-y-0.5 shadow rounded-xl"
                  onClick={() => setIsLogin(true)}
                >
                  Đăng nhập
                </button>
              </div>
              <div
                className={`absolute top-0 left-1/2 w-1/2 h-full flex flex-col items-center justify-center transition duration-700 text-center px-10 text-white space-y-3 ${
                  isLogin ? "" : "transform translate-x-1/5"
                }`}
              >
                <p className="text-3xl font-bold drop-shadow-xl">
                  Chào mừng bạn trở lại 👋
                </p>
                <p className="italic text-gray-200">
                  Nếu bạn chưa có tài khoản, hãy chọn nút đăng ký
                </p>
                <button
                  className="p-2 text-lg bg-white/20 border-2 border-white w-[30%] transition hover:bg-white/0 hover:-translate-y-0.5 shadow rounded-xl"
                  onClick={() => setIsLogin(false)}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
