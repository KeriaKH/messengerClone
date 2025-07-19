import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FriendRequestCard2 from "./FriendRequestCard2";
import { useEffect, useState } from "react";
import { friendSuggest } from "@/types/friendRequest";
import { getFriendSuggest } from "@/services/userService";
import { useAuth } from "./context/AuthContext";

export default function AddFriendPopUp({
  setshowPopUp,
}: {
  setshowPopUp: (item: boolean) => void;
}) {
  const [friendSuggest,setFriendSugget]=useState<friendSuggest[]|null>(null)
  const {user}=useAuth()
  useEffect(()=>{
    if(!user) return
    getFriendSuggest(user?.id).then(res=>{
      console.log(res)
      setFriendSugget(res)
    })
  },[user])
  return (
    <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center" onClick={()=>setshowPopUp(false)}>
      <div
        className="bg-[rgba(31,31,31,255)] w-[40%] h-[50%] p-5 rounded-2xl flex flex-col z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold">Thêm bạn bè</h2>
        <div className="w-full flex items-center bg-[rgba(58,59,60,255)] p-2 px-4 rounded-2xl mt-5">
          <input
            type="text"
            className="w-full focus:outline-none "
            placeholder="Tìm kiếm trên Messenger"
          />
          <FontAwesomeIcon icon={faSearch} className="size-5" />
        </div>
        <h2 className="text-xl font-bold mt-5">Những người bạn có thể biết</h2>
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar mt-2">
          {friendSuggest?.map((item, index) => (
            <FriendRequestCard2 key={index} item={item}/>
          ))}
        </div>
      </div>
    </div>
  );
}
