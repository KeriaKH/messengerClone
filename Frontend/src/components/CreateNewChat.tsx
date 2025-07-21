import { getFriend } from "@/services/userService";
import { friendSuggest } from "@/types/friendRequest";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function CreateNewChat({
  setshowPopUp,
  handleAccept,
}: {
  setshowPopUp: (item: boolean) => void;
  handleAccept: (selectedFriend: string[]) => void;
}) {
  const { user } = useAuth();
  const [friend, setFriend] = useState<friendSuggest[] | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<friendSuggest[]>(
    []
  );

  useEffect(() => {
    if (!user) return;
    getFriend(user?.id).then((res) => {
      console.log(res);
      setFriend(res);
    });
  }, [user]);
  
  return (
    <div
      className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
      onClick={() => setshowPopUp(false)}
    >
      <div
        className="bg-[rgba(31,31,31,255)] w-[40%] h-[50%] p-5 rounded-2xl flex flex-col z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tạo tin nhắn mới</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
            onClick={() => handleAccept([user?.id||"", ...selectedFriend.map((item) => item._id)])}
          >
            Xác nhận
          </button>
        </div>
        <div className="flex items-center mt-5 border-b py-2">
          <span className="text-lg font-semibold">Đến</span>
          <div className="flex-1 flex items-center space-x-2 ml-3">
            {selectedFriend?.map((item, index) => (
              <div
                key={index}
                className="p-1 rounded-xl bg-blue-50 text-blue-500 font-semibold flex items-center"
              >
                {item.name}
                <FontAwesomeIcon icon={faX} className="mx-1 text-sm cursor-pointer"/>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex items-center bg-[rgba(58,59,60,255)] p-2 px-4 rounded-2xl mt-5">
          <input
            type="text"
            className="w-full focus:outline-none "
            placeholder="Tìm kiếm trên Messenger"
          />
          <FontAwesomeIcon icon={faSearch} className="size-5" />
        </div>
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar mt-2">
          {friend?.map((item, index) => (
            <div
              className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition"
              key={index}
              onClick={() => {
                setSelectedFriend((prev) => (prev ? [...prev, item] : [item]));
                setFriend((prev) =>
                  prev ? prev.filter((f) => f._id !== item._id) : null
                );
              }}
            >
              <Image
                src={item.avatar.trim() !== "" ? item.avatar : "/avatar.jpg"}
                alt="avatar"
                width={45}
                height={45}
                className="rounded-full w-[45px] h-[45px] object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
