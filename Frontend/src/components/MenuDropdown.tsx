import {
  faA,
  faArrowRightFromBracket,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { friend } from "@/types/friend";
import { ChangeAvatar, ChangeName, getUserData } from "@/services/userService";
import { uploadImage } from "@/services/cloudinaryService";

export default function MenuDropdown({
  expand,
  isOpen,
  setIsOpen,
}: {
  expand: boolean;
  isOpen: boolean;
  setIsOpen: (item: boolean) => void;
}) {
  const router = useRouter();
  const { LogOut, user } = useAuth();
  const [userData, setUserData] = useState<friend | null>(null);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    getUserData(user.id).then((res) => {
      setUserData(res);
    });
  }, [user]);

  const handleLogOut = () => {
    LogOut();
    router.push("/");
  };

  const handleChangeName = async () => {
    if (newName.trim() === "") {
      return alert("Tên không được để trống");
    }
    ChangeName(userData?._id || "", newName)
      .then(() => {
        setUserData((prev) => (prev ? { ...prev, name: newName } : null));
        setOpenChangeName(false);
        setNewName("");
      })
      .catch((err) => {
        console.error("Error changing name:", err);
        alert("Đổi tên thất bại");
      });
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }
    await uploadImage(file).then((res) => {
      if (res) {
        ChangeAvatar(userData?._id || "", res);
        setUserData((prev) => (prev ? { ...prev, avatar: res } : null));
      }
    });
  };

  const menuItems = [
    {
      id: "customize",
      label: "Chỉnh sửa tên",
      icon: faA,
      function: () => setOpenChangeName(true),
    },
    {
      id: "customizeImage",
      label: "Thay ảnh đại diện",
      icon: faImage,
      function: handleImageUpload,
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: faArrowRightFromBracket,
      function: handleLogOut,
    },
  ];
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
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
                    <div
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-xl ${
                        item.id === "logout"
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-gray-300 hover:bg-white/20"
                      }`}
                      onClick={item.function}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span className="flex-1">{item.label}</span>
                    </div>
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
      {openChangeName && (
        <div
          className="fixed inset-0 z-10 bg-black/50 flex items-center justify-center"
          onClick={() => setOpenChangeName(false)}
        >
          <div
            className="bg-[rgba(31,31,31,255)] w-[40%] p-5 rounded-2xl flex flex-col z-20 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-semibold text-lg">Đổi tên</span>
            <input
              type="text"
              placeholder="Nhập tên"
              className="w-[80%] bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500 mt-5"
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
            />
            <button
              className="mt-5 bg-blue-500 text-white py-2 px-4 rounded w-[50%]"
              onClick={handleChangeName}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
