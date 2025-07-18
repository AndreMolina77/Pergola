const useFetch =()=> {
    const API = 'http://localhost:4000/api'

    const useLogin = async (email, password)=>{
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        if (!response.ok) {
            throw new Error('Error en la autenticación: ' + response.statusText)
        }
        const data = await response.json()
        
        alert(data.message)
        return data
    }
    return { useLogin }
}
export default useFetch