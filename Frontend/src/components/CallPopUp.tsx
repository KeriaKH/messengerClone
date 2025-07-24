import { getUserData } from "@/services/userService";
import { friend } from "@/types/friend";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import React, { useEffect } from "react";
import { useSocket } from "./context/SocketContext";
import { useAuth } from "./context/AuthContext";

export default function CallPopUp({
  setCallReceive,
  whoCalled,
  callType
}: {
  setCallReceive: (value: boolean) => void;
  whoCalled: string | null;
  callType: string | null;
}) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [userData, setUserData] = React.useState<friend | null>(null);
  useEffect(() => {
    if (!whoCalled) return;
    getUserData(whoCalled).then((data) => {
      setUserData(data);
    });
  }, [whoCalled]);

  const handleAcceptCall = () => {
    setCallReceive(false);
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    if (!socket || !callType) return;
    socket.emit("accept_call", {
      from: user?.id,
      to: whoCalled,
    });

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes`;
    window.open(
      `/call?receiver=${whoCalled}&type=${callType}&isCaller=false`,
      "phoneCall",
      features
    );
  };

  const handleRejectCall = () => {
    if (!socket || !user?.id || !whoCalled) return;
    socket.emit("reject_call", {
      from: user.id,
      to: whoCalled,
    });
    setCallReceive(false);
  };
  return (
    <div className="fixed inset-0 w-full h-screen bg-black/30 flex items-center justify-center z-10">
      <div className="w-[20%] h-fit bg-[rgba(31,31,31,255)] rounded-2xl flex flex-col items-center p-5 z-20">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={userData?.avatar || "/avatar.jpg"}
            alt="Receiver Avatar"
            className="rounded-full w-[80px] h-[80px] object-cover"
            width={80}
            height={80}
          />
          <p className="text-white/80 font-semibold text-lg">
            {userData?.name || "Unknown"}
          </p>
        </div>
        <div className="flex mt-5 space-x-5">
          <FontAwesomeIcon
            icon={faPhone}
            className="bg-green-500 text-white rounded-full p-3 hover:bg-green-700 transition"
            onClick={handleAcceptCall}
          />
          <FontAwesomeIcon
            icon={faPhoneSlash}
            className="bg-red-500 text-white rounded-full p-3 hover:bg-red-700 transition"
            onClick={handleRejectCall}
          />
        </div>
      </div>
    </div>
  );
}
