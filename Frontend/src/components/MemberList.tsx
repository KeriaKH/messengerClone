import { MemberListProps } from "@/types/customeType/MemberListProps";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { useSocket } from "./context/SocketContext";

export default function MemberList({ title, members }: MemberListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {onlineUsers} = useSocket();
  return (
    <div className="w-full rounded-xl select-none">
      <div
        className="flex items-center justify-between hover:bg-white/10 p-3 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="font-semibold">{title}</p>
        <FontAwesomeIcon
          icon={isOpen ? faAngleDown : faAngleRight}
          className="size-5"
        />
      </div>
      {isOpen && (
        <div>
          {members.map((item, index) => (
            <div
              key={index}
              className="flex items-center font-semibold space-x-3 hover:bg-white/10 p-3 rounded-xl"
            >
              <div className="relative w-[35px] h-[35px]">
                <Image
                  src={item.id.avatar.trim()!==""?item.id.avatar:"/avatar.jpg"}
                  alt="avatar"
                  width={35}
                  height={35}
                  className="rounded-full w-[35px] h-[35px] object-cover"
                />
                {onlineUsers.includes(item.id._id) && (
                  <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
                )}
              </div>
              <p>
                {item.nickName.trim() !== "" ? item.nickName : item.id.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
