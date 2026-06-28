import {createContext, useContext, useEffect, useState, type ReactNode} from "react";
import type {AxiosInstance} from "axios";
import axios from "axios";

interface User{
    id:string;
    name:string;
    email:string;   
    password:string;
    analysisCount?:number;
}

interface AppContextType{
    user:User | null;
token:string | null;
loading:boolean;
api:AxiosInstance;
login:(email:string, password:string)=>Promise<{success:boolean;message?:string}>;
register:(name:string, email:string, password:string)=>Promise<{success:boolean;message?:string}>;
logout:()=>void;
}

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext=createContext<AppContextType | undefined>(undefined);

export function AppProvider({children}:{children:ReactNode}){
const [user, setUser]=useState<User | null>(null);
const [token, setToken]=useState<string | null>(localStorage.getItem("token"));
const [loading, setLoading]=useState<boolean>(false);

//Axios instance with auth header
const api=axios.create({
    baseURL:BACKEND_URL,});

//update axios header when token changes
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

const loadUser=async()=>{
    if(!token){
        setLoading(false);
        return;
    }
    try{
        const {data}=await api.get("/api/auth/user");
        if(data.success){
            setUser(data.user);
        }
    }catch(error){
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }
    setLoading(false);
}

useEffect(()=>{
    loadUser();
},[token]);

const login=async(email:string, password:string)=>{
    try{
        const response=await api.post(`${BACKEND_URL}/api/auth/login`, {email, password});
        if(response.data.success){
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            return {success:true};
        }
        return {success:false, message:response.data.message};
    }catch(error:any){
        return {success:false, message:error.response?.data?.message || "Login failed"};
    }
}

const register=async(name:string, email:string, password:string)=>{
    try{
        const response=await api.post(`${BACKEND_URL}/api/auth/register`, {name, email, password});
        if(response.data.success){
                // console.log("Token from backend:", response.data.token);

                // localStorage.setItem("token", response.data.token);

                // console.log("Token in localStorage:", localStorage.getItem("token"));
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            return {success:true};
        }
        return {success:false, message:response.data.message};
    }catch(error:any){
        return {success:false, message:error.response?.data?.message || "Registration failed"};
    }
}

const logout=async()=>{
    setToken(null);
     setUser(null);
    localStorage.removeItem("token");
}


    const value={user, token, loading, api, login, register, logout};
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp(){
    const context=useContext(AppContext);
    if(!context){
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}