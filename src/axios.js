import axios from 'axios'

export const API = axios.create({
  baseURL: `http://192.168.1.228:3000/api/org.example.mynetwork.Trader`
})
