import { AxiosError } from "axios";
import api from "./api"
import { signUpData } from "@/types/customeType/signUpData";
import { userData } from "@/types/customeType/userData";

export const login = async (email: string, password: string):Promise<userData|{ message: string }> => {
    try {
        const res = await api.post('api/auth/login', { email, password })
        if (res.data.token) {
            const userData: userData = {
                id: res.data.user._id,
                token: res.data.token,
                email: email,
                expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
            };
            localStorage.setItem('userData', JSON.stringify(userData))
            return userData
        }
        return { message: "Dữ liệu trả về không hợp lệ" };
    } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return {
            message: error.response?.data?.error || "Đã xảy ra lỗi khi đăng nhập",
        };
    }
}

export const signup = async (userData: signUpData) => {
    try {
        const res = await api.post('/api/auth/signup', userData)
        if (res.data) return res.data
        return {}
    } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return {
            message: error.response?.data?.error || "Đã xảy ra lỗi khi đăng nhập",
        };
    }
}

export const logOut = () => {
    try {
        localStorage.removeItem('userData')
    } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return {
            message: error.response?.data?.error || "Đã xảy ra lỗi khi đăng nhập",
        };
    }
}

export const isLogin = () => {
    try {
        const raw = localStorage.getItem('userData')
        if (!raw) return false
        const user = JSON.parse(raw)
        if (user.expiresAt < new Date().getTime()) {
            logOut()
            return false
        }
        return true
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return {
            message: error.response?.data?.error || "Đã xảy ra lỗi khi đăng nhập",
        };
    }
}

export const getUserData = (): userData | null => {
    try {
        const raw = localStorage.getItem('userData')
        if (!raw) return null
        const user = JSON.parse(raw)
        return user
    } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}