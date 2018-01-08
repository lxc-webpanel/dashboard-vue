import _reduce from 'lodash/reduce';
import _isPlainObject from 'lodash/isPlainObject';
import { validationMixin } from 'vuelidate';

export default {
  mixins: [validationMixin],
  computed: {
    validate() {
      return this.rules && this.rules !== '';
    },
    required() {
      return this.rules && this.rules.indexOf('required') !== -1;
    },
    errors() {
      if (!this.validate) return [];

      if (!this.label || typeof this.value === 'undefined') {
        throw new Error("[LWP] errors mixin requires 'label' and 'value' data");
      }

      const errors = [];

      if (this.$v && this.$v.value.$error) {
        Object.keys(this.$v.value).forEach((key) => {
          // TODO: clean this up!
          // Looking for this: this.$v.value.$each[VALUES_INDEX][RULE_NAME]
          if (key === '$each' && typeof this.$v.value[key] === 'object') {
            // Loop over each '$each' keys...
            Object.keys(this.$v.value.$each).forEach((eachKey) => {
              // ...only look for ones that are not vuelidate values (do not start with '$')...
              if (!eachKey.startsWith('$') && _isPlainObject(this.$v.value.$each[eachKey])) {
                // ...loop over each '$each[eachKey]' keys...
                Object.keys(this.$v.value.$each[eachKey]).forEach((k) => {
                  // ...only look for ones that are not vuelidate values (again)...
                  if (!k.startsWith('$') && typeof this.$v.value.$each[eachKey][k] === 'boolean' && !this.$v.value.$each[eachKey][k]) {
                    const errorParams = this.$v.value.$each[eachKey].$params[k].errorParams || [];

                    errors.push(this.$t(`form.errors.${k}`, [this.label, ...errorParams]));
                  }
                });
              }
            });
          } else if (!key.startsWith('$') && typeof this.$v.value[key] === 'boolean' && !this.$v.value[key]) {
            const errorParams = this.$v.value.$params[key].errorParams || [];

            errors.push(this.$t(`form.errors.${key}`, [this.label, ...errorParams]));
          }
        });
      }

      return errors;
    }
  },
  validations() {
    if (!this.validate) return {};

    // Parse 'rules' prop (validator:param1:param2|validator:param1...):
    // e.g.: required|maxLength:64
    const rules = _reduce(this.rules.split('|'), (validators, rule) => {
      const params = rule.split(':');
      let validator = params.shift();
      const isEach = (validator === '$each');

      if (isEach) {
        validator = params.shift();
      }

      const func = require(`../libraries/utils/validators/${validator}`).default; // eslint-disable-line max-len, import/no-dynamic-require
      let validation = { [validator]: params.length > 0 ? func(...params) : func };

      if (isEach) {
        validation = Object.assign({}, { $each: validation });
      }

      return Object.assign(validators, validation);
    }, {});

    return {
      value: { ...rules }
    };
  },
  methods: {
    onInput(value) {
      if (this.$v.value) {
        this.$v.value.$touch();
      }

      this.$emit('input', {
        dirty: (this.$v.value && this.$v.value.$dirty) || false,
        invalid: (this.$v.value && this.$v.value.$invalid) || false,
        label: this.label,
        value
      });
    }
  },
  mounted() {
    this.$emit('input', {
      dirty: false,
      invalid: this.required,
      label: this.label,
      value: this.value
    });
  }
};
