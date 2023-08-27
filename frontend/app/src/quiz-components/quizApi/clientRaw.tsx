import axios from "axios"

const clientRaw = axios.create({
    baseURL: 'http://localhost:3001',
});

export default clientRaw;