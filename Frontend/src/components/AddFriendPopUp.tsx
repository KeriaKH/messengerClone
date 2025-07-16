import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";

export default function AddFriendPopUp({
  setshowPopUp,
}: {
  setshowPopUp: (item: boolean) => void;
}) {
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setshowPopUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setshowPopUp]);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[rgba(31,31,31,255)] w-[40%] h-[50%] p-5 rounded-2xl" ref={selectRef}>
        <h2 className="text-2xl font-bold">Thêm bạn bè</h2>
        <div className="w-full flex items-center bg-[rgba(58,59,60,255)] p-2 px-4 rounded-2xl mt-5">
          <input
            type="text"
            className="w-full focus:outline-none "
            placeholder="Tìm kiếm trên Messenger"
          />
          <FontAwesomeIcon icon={faSearch} className="size-5" />
        </div>
      </div>
    </div>
  );
}
