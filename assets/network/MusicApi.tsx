/* eslint-disable prettier/prettier */
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // 设置为你的本地 API 基础 URL

export const loginWithCellphone = async (phone:any, password:any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/cellphone`, null, {
      params:{
        phone,
        password,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};
