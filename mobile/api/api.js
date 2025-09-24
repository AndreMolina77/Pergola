import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pergola.onrender.com/api', // NO VAYAN A TOCAR
});
export default api;