import { AxiosError } from "axios"
import api from "./api"

export const getMessage = async (id: string) => {
    try {
        const res = await api.get(`api/chat/${id}`)
        if (res.data)
            return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}