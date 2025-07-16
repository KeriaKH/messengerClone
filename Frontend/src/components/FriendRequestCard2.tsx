import Image from "next/image";

export default function FriendRequestCard2() {
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
      <div className="text-xs bg-blue-500/50 text-blue-200 hover:bg-blue-500/30 cursor-pointer p-2 rounded-xl transition">
        Thêm bạn bè 
      </div>
    </div>
  );
}
