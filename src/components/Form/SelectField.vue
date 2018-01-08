<template>
  <v-select
    :label="required ? `${label}*` : label"
    v-model="value"
    @input="onInput"
    :items="items"
    :error-messages="errors"
    :hint="hint"
    :persistent-hint="persistentHint"
    :multiple="multiple"
    :chips="chips"
    :bottom="bottom"
    :single-line="singleLine"></v-select>
</template>

<script>
  import fieldMixin from '../../mixins/field';

  export default {
    mixins: [fieldMixin],
    props: {
      bottom: Boolean,
      chips: Boolean,
      hint: String,
      items: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      multiple: Boolean,
      persistentHint: Boolean,
      rules: String,
      singleLine: Boolean
    },
    data() {
      return {
        value: ''
      };
    }
  };
</script>
