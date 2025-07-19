import { friendRequest } from "@/types/friendRequest"
import api from "./api"
import { AxiosError } from "axios"

export const getFriendRequest = async (id: string): Promise<friendRequest[] | null> => {
    try {
        const res = await api.get(`api/friendRequest/${id}`)
        if (res.data) return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const sendFriendRequest = async (sender: string,receiver:string) => {
    try {
        const data={sender,receiver}
        await api.post(`api/friendRequest`,data)
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
    }
}