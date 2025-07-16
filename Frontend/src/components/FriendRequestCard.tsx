import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function FriendRequestCard() {
  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <Image
        src="/avatar.jpg"
        alt="avatar"
        width={45}
        height={45}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">Thế Vinh</p>
      </div>
      <div className="text-xs space-x-4 flex items-center cursor-pointer">
        <FontAwesomeIcon icon={faCheck} className="p-2 bg-blue-500 rounded-full hover:bg-blue-700 transition"/>
        <FontAwesomeIcon icon={faX} className="p-2 bg-black rounded-full hover:bg-black/10 transition"/>
      </div>
    </div>
  );
}
