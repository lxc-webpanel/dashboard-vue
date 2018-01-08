<template>
  <v-slider
    :label="required ? `${label}*` : label"
    :max="max"
    v-model="value"
    @input="onInput"
    :hint="hint"
    :persistent-hint="persistentHint"
    :error-messages="errors"></v-slider>
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
      max: Number,
      persistentHint: Boolean,
      rules: String
    },
    data() {
      return {
        value: 0
      };
    }
  };
</script>
