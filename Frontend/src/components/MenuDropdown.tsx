import {
  faA,
  faArrowRightFromBracket,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { friend } from "@/types/friend";
import { getUserData } from "@/services/userService";

export default function MenuDropdown({
  expand,
  isOpen,
  setIsOpen,
}: {
  expand: boolean;
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
}) {
  console.log("hello")
  const router = useRouter();
  const { LogOut, user } = useAuth();
  const [userData, setUserData] = useState<friend | null>(null);

  useEffect(() => {
    if(!user) return
    getUserData(user?.id).then((res) => {
      console.log(res);
      setUserData(res);
    });
  }, [user]);

  const handleLogOut = () => {
    LogOut();
    router.push("/");
  };

  const menuItems = [
    {
      id: "customize",
      label: "Chỉnh sửa tên",
      icon: faA,
      function: () => {},
    },
    {
      id: "customizeImage",
      label: "Thay ảnh đại diện",
      icon: faImage,
      function: ()=>{},
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: faArrowRightFromBracket,
      function: handleLogOut,
    },
    
  ];
  return (
    <div className="relative inline-block flex-1">
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute bottom-full left-0 right-0 ml-2 w-60 bg-[rgba(46,46,46,255)] rounded-2xl shadow z-20">
            {/* Menu Items */}
            <div className="p-2 max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-xl ${
                      item.id === "logout"
                        ? "text-red-400 hover:bg-red-900/20"
                        : "text-gray-300 hover:bg-white/20"
                    }`}
                    onClick={item.function}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span className="flex-1">{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Trigger Button */}
      <div
        className={`flex items-center space-x-2 ${
          expand ? "hover:bg-white/30 px-3 py-1 rounded-lg transition" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={userData?.avatar || "/avatar.jpg"}
          alt="avatar"
          width={35}
          height={35}
          className="rounded-full shadow-2xl object-cover w-[35px] h-[35px]"
        />
        {expand && <p className="text-xs">{userData?.name}</p>}
      </div>
    </div>
  );
}
