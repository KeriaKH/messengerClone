import { friend } from "../friend";


export type Member = {
    id: friend
    nickName: string
}

export type MemberListProps = {
    title: string;
    members: Member[]
};


