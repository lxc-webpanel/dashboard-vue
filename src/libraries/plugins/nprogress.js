/**
 * nProgress plugin
 */
import nProgress from 'nprogress';
// import store from '../store';
import router from '../router';

export default (Vue) => {
  router.beforeEach((to, from, next) => {
    nProgress.start();
    return next();
  });

  router.afterEach(() => {
    nProgress.done();
  });

  // mount the authorize to Vue component instance
  Object.defineProperties(Vue.prototype, {
    $nprogress: {
      get: () => {
        console.log('qsds');
        return null;
      }
    }
  });
};
