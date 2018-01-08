import { withParams } from 'vuelidate/lib';
import { req, len } from 'vuelidate/lib/validators/common';

export default max => withParams(
  {
    type: 'maxLength',
    max,
    errorParams: [max]
  },
  value => !req(value) || len(value) <= max
);
