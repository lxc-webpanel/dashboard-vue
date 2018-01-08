<template>
  <v-snackbar
    bottom
    :error="type === 'error'"
    :success="type === 'success'"
    :info="type === 'info'"
    :warning="type === 'warning'"
    v-model="showSnack">
    {{ message }}
  </v-snackbar>
</template>

<script>
  export default {
    name: 'lwp-notifications',
    data() {
      return {
        type: 'success',
        tmp: true
      };
    },
    computed: {
      message() {
        return this.$store.state.notifications.messages.length > 0 ? this.$store.state.notifications.messages[0] : ''; // eslint-disable-line max-len
      },
      showSnack: {
        get() {
          return this.$store.state.notifications.active && this.$store.state.notifications.messages.length > 0; // eslint-disable-line max-len
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeNotif');
          }
        }
      }
    }
  };
</script>
