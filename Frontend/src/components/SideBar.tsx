"use client";

import {
  faComment,
  faExpand,
  faUserGroup,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import MenuDropdown from "./MenuDropdown";

export default function SideBar({setSideBarOption}:{setSideBarOption:(option:string)=>void}) {
  const [expand, setExpand] = useState(false);
  const [isOpen,setIsOpen]=useState(false)
  return (
    <div
      className={`h-full flex flex-col justify-between ${
        expand ? " w-[10%]" : "w-[2%] items-center"
      }`}
    >
      <div className="flex flex-col space-y-5">
        <div className={`flex items-center space-x-3 cursor-pointer ${expand?"hover:bg-white/30 p-3 rounded-lg transition":""}`} onClick={()=>setSideBarOption("message")}>
          <FontAwesomeIcon
            icon={faComment}
            className={`size-5 ${expand?"":"p-3 rounded-lg hover:bg-white/30 transition"} text-xl`}
          />
          {expand && <p className="font-semibold">Đoạn chat</p>}
        </div>
        <div className={`flex items-center space-x-3 cursor-pointer ${expand?"hover:bg-white/30 p-3 rounded-lg transition":""}`} onClick={()=>setSideBarOption("friend")}>
          <FontAwesomeIcon
            icon={faUserGroup}
            className={`size-5 ${expand?"":"p-3 rounded-lg hover:bg-white/30 transition"} text-xl`}
          />
          {expand && <p className="font-semibold">Bạn bè</p>}
        </div>
        <div className={`flex items-center space-x-3 cursor-pointer ${expand?"hover:bg-white/30 p-3 rounded-lg transition":""}`} onClick={()=>setSideBarOption("friendRequest")}>
          <FontAwesomeIcon
            icon={faUserPlus}
            className={`size-5 ${expand?"":"p-3 rounded-lg hover:bg-white/30 transition"} text-xl`}
          />
          {expand && <p className="font-semibold">Lời mời kết bạn</p>}
        </div>
      </div>
      <div
        className={`flex w-full ${
          expand ? "justify-between" : "flex-col space-y-5 items-center"
        }`}
      >
        <MenuDropdown expand={expand} isOpen={isOpen} setIsOpen={setIsOpen}/>
        <FontAwesomeIcon
          icon={faExpand}
          onClick={() => setExpand(!expand)}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition text-xl cursor-pointer"
        />
      </div>
    </div>
  );
}
