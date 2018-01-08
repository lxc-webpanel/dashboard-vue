/**
 * Containers service
 */

import { axios } from '../utils';
import Resource from './resource';

class ContainerResource extends Resource {
  start(id) {
    return axios.post(`/${this.base}/${id}/start`);
  }

  stop(id) {
    return axios.post(`/${this.base}/${id}/stop`);
  }

  freeze(id) {
    return axios.post(`/${this.base}/${id}/freeze`);
  }

  unfreeze(id) {
    return axios.post(`/${this.base}/${id}/unfreeze`);
  }

  shutdown(id) {
    return axios.post(`/${this.base}/${id}/shutdown`);
  }

  restart(id) {
    return axios.post(`/${this.base}/${id}/restart`);
  }
}

export default new ContainerResource('lxc/containers');
