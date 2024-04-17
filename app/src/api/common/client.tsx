import { Env } from '@env';
import axios from 'axios';

import { getToken } from '@/core/auth/utils';

const client = axios.create({
  baseURL: Env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: getToken().access
      ? `Bearer ${getToken().access}`
      : undefined,
  },
});

client.interceptors.request.use((request) => {
  // console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

// const refreshAccessToken = () => {
//   axios
//     .post('/auth/refresh', {
//       refresh_token: userToken.refresh,
//       mode: 'json',
//     })
//     .then((res) => {
//       const data = res.data;
//       setToken({ access: data?.access_token, refresh: data?.refresh_token });
//       return res.data?.access_token;
//     })
//     .catch(() => {
//       removeToken();
//       router.push('/login');
//     });

//   return null;
// };

client.interceptors.response.use(
  (response) => {
    // console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
  }
  // async (error) => {
  //   const originalRequest = error.config;
  //   console.log(error);
  //   if (error.response.status === 401 && !originalRequest._retry) {
  //     originalRequest._retry = true;
  //     const access_token = await refreshAccessToken();
  //     axios.defaults.headers.common.Authorization = 'Bearer ' + access_token;
  //     return client(originalRequest);
  //   }
  //   return Promise.reject(error);
  // }
);

export { client };
