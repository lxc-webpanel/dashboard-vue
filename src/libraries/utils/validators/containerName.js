import { regex } from 'vuelidate/lib/validators/common';

const containerNameRegex = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9-]*[A-Za-z0-9])$/;

export default regex('containerName', containerNameRegex);
