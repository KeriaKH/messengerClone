"use client";

import Image from "next/image";
import React from "react";
import CustomSelect from "./CustomSelect";
import { Option } from "@/types/customeType/customSelect";
import { faA, faPalette, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const chatOptions: Option[] = [
  {
    text: "Đổi chủ đề",
    icon: faPalette
  },
  {
    text: "Đổi biểu tượng cảm xúc",
    icon: faThumbsUp
  },
  {
    text: "Chỉnh sửa biệt danh",
    icon: faA
  }
];
  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-5 flex flex-col items-center">
      <div className="space-y-3 flex flex-col items-center">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
        <div className="text-center">
          <p className="text-xl font-semibold">Lưu Nguyễn Thế Vinh</p>
          <p className="text-white/30 text-sm">luuvinh909@gmail.com</p>
        </div>
        <p className="text-white/30">Đang hoạt động</p>
      </div>
      <CustomSelect title="Tùy chỉnh đoạn chat" options={chatOptions}/>
    </div>
  );
}
