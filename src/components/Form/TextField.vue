<template>
  <v-text-field
    :type="type"
    :label="required ? `${label}*` : label"
    v-model="value"
    @input="onInput"
    :error-messages="errors"
    :hint="hint"
    :persistent-hint="persistentHint"
    :multi-line="multiLine"
    :suffix="suffix"></v-text-field>
</template>

<script>
  import fieldMixin from '../../mixins/field';

  export default {
    mixins: [fieldMixin],
    props: {
      hint: String,
      label: {
        type: String,
        required: true
      },
      multiLine: Boolean,
      persistentHint: Boolean,
      rules: String,
      suffix: String,
      type: {
        type: String,
        default: 'text'
      }
    },
    data() {
      return {
        value: ''
      };
    }
  };
</script>
