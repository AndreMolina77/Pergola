import React, { createContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = "https://pergola.onrender.com/api";

    useEffect(() => {
        const loadUserSession = async () => {
            try {
                const userSession = await AsyncStorage.getItem("userSession");
                if (userSession) {
                    const userData = JSON.parse(userSession);
                    setUser(userData);
                    setAuthToken("authenticated");
                }
            } catch (error) {
                console.log("No hay sesión guardada");
            }
        };
        loadUserSession();
    }, []);

    const clearSession = async () => {
        await AsyncStorage.removeItem("userSession");
        setUser(null);
        setAuthToken(null);
    };

    const logout = useCallback(async () => {
        try{
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            await clearSession();
            ToastAndroid.show("Sesión cerrada correctamente", ToastAndroid.SHORT);
        }
    }, [API_URL]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    platform: "mobile" // Indicar que es desde móvil
                }),
            });
         
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                // RESTRICCIÓN: Solo permitir clientes en la app móvil
                if (data.user && data.user.userType !== "customer") {
                    ToastAndroid.show("Esta aplicación es solo para clientes", ToastAndroid.LONG);
                    return false;
                }

                // Guardar sesión del usuario (solo clientes)
                const userSession = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    lastName: data.user.lastName,
                    userType: data.user.userType,
                    loginTime: Date.now()
                };
                
                await AsyncStorage.setItem("userSession", JSON.stringify(userSession));
                setUser(userSession);
                setAuthToken("authenticated");
                
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