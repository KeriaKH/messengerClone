"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useSocket } from "@/components/context/SocketContext";
import { getUserData } from "@/services/userService";
import { friend } from "@/types/friend";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function CallPage() {
  const { searchParams } = new URL(window.location.href);
  const receiver = searchParams.get("receiver");
  const type = searchParams.get("type");
  const isCaller = searchParams.get("isCaller") === "true";
  const { user } = useAuth();
  const { socket } = useSocket();
  const [receiverData, setReceiverData] = useState<friend | null>(null);
  const [callAccepted, setCallAccepted] = useState(!isCaller);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [callStatus, setCallStatus] = useState("Đang gọi...");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const localAudio = useRef<HTMLAudioElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (receiver)
      getUserData(receiver).then((data) => {
        setReceiverData(data);
      });
  }, [receiver]);

  useEffect(() => {
    const handleUnload = () => {
      if (!socket || !user?.id || !receiver) return;
      if (!callAccepted && isCaller && callStatus === "Đang gọi...") {
        socket.emit("call_end_before_accept", {
          from: user.id,
          to: receiver,
        });
        return;
      }
      socket.emit("end_call", {
        from: user.id,
        to: receiver,
      });
      stream?.getTracks().forEach((track) => track.stop());
      peer?.destroy();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [
    socket,
    stream,
    peer,
    user?.id,
    receiver,
    isCaller,
    callAccepted,
    callStatus,
  ]);

  useEffect(() => {
    if (!socket) return;
    const handleCallEnded = () => {
      stream?.getTracks().forEach((track) => track.stop());
      peer?.destroy();
      setCallAccepted(false);
      setCallStatus("Cuộc gọi đã kết thúc tự động tắt sau 5 giây");
      setTimeout(() => {
        window.close();
      }, 5000);
    };
    socket.on("call_ended", handleCallEnded);

    return () => {
      socket.off("call_ended", handleCallEnded);
    };
  }, [peer, socket, stream, user?.id]);

  useEffect(() => {
    if (!isCaller) return;
    if (!socket || !receiver) return;
    const handleCallAccepted = () => {
      setCallAccepted(true);
    };
    socket.on("call_accepted", handleCallAccepted);
    return () => {
      socket.off("call_accepted", handleCallAccepted);
    };
  }, [isCaller, receiver, socket]);

  useEffect(() => {
    if (!isCaller) return;
    if (!socket || !receiver) return;
    const handleCallRejected = () => {
      setCallAccepted(false);
      setCallStatus("Cuộc gọi đã bị từ chối. Tự động tắt sau 5 giây");
      setTimeout(() => {
        window.close();
      }, 5000);
    };
    socket.on("call_rejected", handleCallRejected);
    return () => {
      socket.off("call_rejected", handleCallRejected);
    };
  }, [isCaller, receiver, socket]);

  useEffect(() => {
    if (!user?.id || !receiver) return;

    const newPeer = new Peer(user.id, {
      host: "localhost",
      port: 5000,
      path: "/peerjs",
      secure: false,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    newPeer.on("open", (id) => {
      console.log("✅ PeerJS connected with ID:", id);
      setPeer(newPeer);
    });

    navigator.mediaDevices
      .getUserMedia(
        type === "audio"
          ? { audio: true, video: false }
          : { audio: true, video: true }
      )
      .then((stream) => {
        setStream(stream);
        if (type === "video" && localVideo.current)
          localVideo.current.srcObject = stream;
        else if (localAudio.current) localAudio.current.srcObject = stream;

        // Callee: setup call listener
        newPeer.on("call", (call) => {
          console.log("📞 Callee received call, answering...");
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            console.log(
              "📥 Callee received remote stream:",
              remoteStream.getTracks()
            );
            if (type === "video" && remoteVideo.current) {
              remoteVideo.current.srcObject = remoteStream;
            } else if (remoteAudio.current) {
              remoteAudio.current.srcObject = remoteStream;
            }
          });
        });
      })
      .catch((err) => {
        console.error("❌ Media access error:", err);
      });

    return () => {
      newPeer.destroy();
    };
  }, [receiver, user?.id, type]);

  useEffect(() => {
    if (!isCaller || !callAccepted || !peer || !stream || !receiver) return;

    const targetPeerId = receiver;
    console.log("⏳ Caller making call to:", targetPeerId);
    console.log(
      "🔍 Peer state:",
      peer.disconnected ? "disconnected" : "connected"
    );

    if (peer.disconnected) {
      console.log("❌ Peer is disconnected, cannot make call");
      return;
    }

    setTimeout(() => {
      try {
        const call = peer.call(targetPeerId, stream);
        if (!call) {
          console.error("❌ Call object is undefined");
          return;
        }

        console.log("📞 Call initiated:", call);

        call.on("stream", (remoteStream) => {
          console.log(
            "📥 Caller received remote stream:",
            remoteStream.getTracks()
          );
          if (type === "video" && remoteVideo.current) {
            const videoElement = remoteVideo.current;
            videoElement.srcObject = null;
            videoElement.srcObject = remoteStream;
            videoElement.onloadedmetadata = () => {
              videoElement.play().catch((e) => {
                console.log("Video play postponed:", e);
                // ✅ Retry play sau 500ms
                setTimeout(() => {
                  videoElement
                    .play()
                    .catch((err) => console.error("Video play failed:", err));
                }, 500);
              });
            };
          } else if (remoteAudio.current) {
            remoteAudio.current.srcObject = remoteStream;
            remoteAudio.current
              .play()
              .catch((e) => console.error("Audio play error:", e));
          }
        });

        call.on("error", (err) => {
          console.error("❌ Call error:", err);
        });
      } catch (error) {
        console.error("❌ Error making call:", error);
      }
    }, 2000);
  }, [isCaller, callAccepted, peer, stream, receiver, type]);

  const handleEndCall = () => {
    if (!socket) return;
    socket.emit("end_call", {
      from: user?.id,
      to: receiver,
    });
    stream?.getTracks().forEach((track) => track.stop());
    peer?.destroy();
    setTimeout(() => {
      window.close();
    }, 300);
    return () => {
      socket.off("end_call");
    };
  };

  return (
    <div
      className={`relative h-screen w-full bg-center bg-cover bg-no-repeat `}
      style={{
        backgroundImage: `url(${receiverData?.avatar || "/avatar.jpg"})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl">
        {type === "video" && callAccepted ? (
          <div className="relative w-full h-full ">
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <video
              ref={localVideo}
              autoPlay
              muted
              className="absolute bottom-4 right-4 w-32 h-24 object-cover rounded-lg border-2 border-white/20"
            ></video>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src={receiverData?.avatar || "/avatar.jpg"}
              alt="Receiver Avatar"
              className="rounded-full w-[100px] h-[100px] object-cover"
              width={100}
              height={100}
            />
            <h2 className="text-white/80 font-semibold text-xl">
              {receiverData?.name || "Unknown"}
            </h2>
          </div>
        )}
        {callAccepted ? (
          <div className="absolute bottom-10 flex justify-center w-full">
            <FontAwesomeIcon
              icon={faPhone}
              className="bg-red-500 text-white rounded-full p-5 hover:bg-red-700 transition"
              onClick={handleEndCall}
            />
          </div>
        ) : (
          <p className="absolute bottom-10 text-white flex justify-center w-full font-semibold text-shadow">
            {callStatus}
          </p>
        )}
        <audio ref={localAudio} autoPlay muted />
        <audio ref={remoteAudio} autoPlay />
      </div>
    </div>
  );
}
