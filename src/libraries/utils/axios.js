/**
 * Custom axios instance
 * > - [Axios的配置](https://blog.ygxdxx.com/2017/01/29/Axios-Config/)
 * > - [Vuex2和Axios的开发](https://blog.ygxdxx.com/2017/02/01/Vuex2&Axios-Develop/)
 * > - [Axios全攻略](https://blog.ygxdxx.com/2017/02/27/Axios-Strategy/)
 * > - [Vue 全家桶 + axios 前端实现登录拦截、登出、拦截器等功能](https://github.com/superman66/vue-axios-github)
 * > - [axios和网络传输相关知识的学习实践](http://www.jianshu.com/p/8e5fb763c3d7)
 * > - [Vue.js REST API Consumption with Axios](https://alligator.io/vuejs/rest-api-axios/)
 */

import axios from 'axios';
import normalize from 'json-api-normalizer';
import storage from './storage';
import { STORAGE_TOKEN_KEY } from '../store/modules/auth';
import router from '../router';

const instance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Redirect to '/login' if API returns 401
instance.interceptors.response.use((response) => {
  const res = response.config.url.includes('auth') ? response : normalize(response.data);

  return res;
}, (err) => {
  console.log('[AXIOS:response:error]', err, err.response);

  if (err.response.status && err.response.status === 401) {
    console.log('⛔️  Unauthorized');

    storage.remove(STORAGE_TOKEN_KEY);

    router.replace({ name: 'login', query: { redirect: router.currentRoute.fullPath } });
  }

  return Promise.reject(err);
});

// Set 'Authorization' header
instance.interceptors.request.use((requestConfig) => {
  const token = storage.get(STORAGE_TOKEN_KEY);

  const config = requestConfig;
  const headers = requestConfig.headers || {};
  config.headers = headers;

  if (token !== null && token !== 'undefined' && typeof token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
