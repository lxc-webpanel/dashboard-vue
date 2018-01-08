<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent>
      <v-btn error slot="activator">{{ $t('host.actions.reboot') }}</v-btn>
      <v-card>
        <v-card-title class="headline">{{ $t('host.messages.reboot_dialog_headline') }}</v-card-title>
        <v-card-text>
          <p class="body-2">{{ $t('host.messages.reboot_dialog_subheadline') }}</p>
          <p class="body-1">{{ $t('host.messages.reboot_dialog_body') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="grey--text" flat @click="dialog = false">
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn class="white--text" error @click="onConfirm">
            {{ $t('host.actions.reboot') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        dialog: false
      };
    },
    methods: {
      ...mapActions([
        'rebootHost'
      ]),
      onConfirm() {
        this.rebootHost();

        this.dialog = false;
      }
    }
  };
</script>
