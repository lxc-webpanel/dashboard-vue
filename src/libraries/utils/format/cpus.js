import I18n from '../../i18n';

export default function cpus(value) {
  if (!value) return null;

  if (value.indexOf('-') !== -1) {
    return value.split('-').join(` ${I18n.t('to')} `);
  }

  if (value.indexOf(',') !== -1) {
    return value.split(',').join(` ${I18n.t('and')} `);
  }

  return value;
}
