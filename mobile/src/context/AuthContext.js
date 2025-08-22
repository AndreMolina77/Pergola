import React, { createContext, useState, useCallback, useEffect, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = "https://pergola.onrender.com/api";
    // la ip de la computadora ya no localhost 

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                setAuthToken(token);
                // Aquí podrías hacer una llamada a la API para obtener el usuario
                // setUser(obtenidoDesdeLaApi);
            }
        }
        loadToken();
    }, []);

    const clearSession = async () => {
        await AsyncStorage.removeItem("token");
        setUser(null);
        setAuthToken(null);
    };

    const logout = useCallback(async () => {
        try{
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
        });
    } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            await clearSession();
            ToastAndroid.show("Sesión cerrada correctamente", ToastAndroid.SHORT);
        }
    }, [API_URL]);

    const login = async (email, password ) => {
         try {
            const response = await fetch (`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
         
            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("token", data.token);
                setAuthToken(data.token);
                console.log(data);
                setUser(data.username);
                ToastAndroid.show("Inicio de sesión exitoso", ToastAndroid.SHORT);
                return true;
            } else {
                ToastAndroid.show(data.message || "Error al iniciar sesión", ToastAndroid.SHORT);
                return false;
            }
        } catch (error) {
            console.error("Error during login:", error);
            ToastAndroid.show("Error de conexión", ToastAndroid.SHORT);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch (`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                ToastAndroid.show("Registro exitoso", ToastAndroid.SHORT);
                return true;
            } else {
                const data = await response.json();
                ToastAndroid.show(data.message || "Error al registrarse", ToastAndroid.SHORT);
                return false;
            }
        } catch (error) {
            console.error("Error during registration:", error);
            ToastAndroid.show("Error de conexión", ToastAndroid.SHORT);
            return false;
        }
    };

    return(
        <AuthContext.Provider value={{ user, authToken, loading, login, logout, register, API: API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};