/**
 * Host service
 */

import { axios } from '../utils';

class Host {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

  reboot() {
    return axios.post(`/${this.base}/reboot`, { message: 'Reboot from LXC Web Panel!' });
  }
}

export default new Host('lwp/host');
