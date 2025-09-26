import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pergola-production.up.railway.app/api', // NO VAYAN A TOCAR
});
export default api;