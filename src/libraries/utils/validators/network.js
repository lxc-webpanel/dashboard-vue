import { withParams } from 'vuelidate/lib';
import { req } from 'vuelidate/lib/validators/common';

const networkRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])(:[0-9]+)?$/;

export default withParams(
  { type: 'network' },
  value => !req(value) || networkRegex.test(value)
);
