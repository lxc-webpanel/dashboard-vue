import Vue from 'vue';
import I18n from 'vue-i18n';

Vue.use(I18n);

// https://kazupon.github.io/vue-i18n/dynamic.html
export default new I18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    en: require('../../assets/locales/en'),
    fr: require('../../assets/locales/fr')
  }
});
