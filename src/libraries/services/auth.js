/**
 * Auth service
 */

import { axios } from '../utils';

class Auth {
  constructor(base) {
    this.base = base;
  }

  token(options) {
    return axios.post(this.url(), options);
  }

  check() {
    return axios.get(this.url('check'));
  }

  refresh() {
    return axios.post(this.url('refresh'));
  }

  url(path) {
    const p = path ? `/${path}` : '';
    return `/${this.base}${p}`;
  }
}

export default new Auth('auth');
