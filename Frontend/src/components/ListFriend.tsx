"use client";

import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FriendCard from "./FriendCard";

export default function ListFriend({setshowPopUp}:{setshowPopUp:(item:boolean)=>void}) {
  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-3 space-y-3 flex flex-col">
      <div className="text-xl font-bold flex justify-between items-center">
        <h2 className="text-2xl">Danh sách bạn bè</h2>
        <FontAwesomeIcon
          icon={faUserPlus}
          className="p-2.5 hover:bg-white/30 bg-white/20 rounded-full size-5"
          onClick={()=>setshowPopUp(true)}
        />
      </div>
      <div className="w-full flex items-center bg-[rgba(58,59,60,255)] p-2 px-4 rounded-2xl">
        <input
          type="text"
          className="w-full focus:outline-none "
          placeholder="Tìm kiếm trên Messenger"
        />
        <FontAwesomeIcon icon={faSearch} className="size-5" />
      </div>
      <div className="overflow-y-auto overflow-x-hidden h-full custom-scrollbar">
        {Array.from({ length: 20 }).map((_, index) => (
          <FriendCard key={index} />
        ))}
      </div>
    </div>
  );
}
