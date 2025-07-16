import { CustomSelectProps } from "@/types/customeType/customSelect";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function CustomSelect({ title, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full rounded-xl select-none">
      <div
        className="flex items-center justify-between hover:bg-white/10 p-3 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="font-semibold">{title}</p>
          <FontAwesomeIcon icon={isOpen?faAngleDown:faAngleRight} className="size-5"/>
      </div>
      {isOpen && (
        <div>
          {options.map((item, index) => (
            <div
              key={index}
              className="flex items-center font-semibold space-x-3 hover:bg-white/10 p-3 rounded-xl"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="p-2 bg-white/20 rounded-full text-sm"
              />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
