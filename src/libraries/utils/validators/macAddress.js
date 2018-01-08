import { withParams } from 'vuelidate/lib';
import { req } from 'vuelidate/lib/validators/common';

const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export default withParams(
  { type: 'macAddress' },
  value => !req(value) || macAddressRegex.test(value)
);
