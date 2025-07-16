export type Message = {
  _id?: number;
  text: string;
  sender: "user" | "friend";
  time: string;
  avatar?: '/avatar.jpg'
  images?:string[]
};
