import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './src/screens/SplashScreen';
import MainApp from './src/MainApp'; 
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Preparar recursos de la app
    async function prepare() {
      try {
        // Mantener el splash screen nativo visible
        await SplashScreen.preventAutoHideAsync();
        
        // Simular carga de recursos (fuentes, datos, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Marcar la app como lista
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  // Si la app no está lista, mostrar pantalla en blanco
  if (!appIsReady) {
    return null;
  }

  // Mostrar splash screen personalizado
  if (isLoading) {
    return (
      <>
        <StatusBar style="dark" backgroundColor="#E8E1D8" />
        <CustomSplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <MainApp />
    </>
  );
}