<template>
  <div class="login-wrapper">
    <section class="login">
      <header>
        <h1 class="brand"><router-link to="/" tabindex="-1"><img class="login-logo" src="../../assets/logo.svg" /></router-link></h1>
      </header>
      <v-alert v-if="logout" info value="true">{{ $t('messages.logged_out') }}</v-alert>
      <v-card class="grey lighten-4 elevation-0">
        <v-card-text>
          <form action="#" autocomplete="off" @submit.prevent="submit">
            <v-container fluid>
              <v-layout column>
                <v-flex xs12>
                  <v-text-field
                    name="input-10-1"
                    label="Username"
                    type="text"
                    v-model="username"
                    :rules="[errors.username]"
                    :error="errors.username"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    name="input-10-1"
                    label="Password"
                    v-model="password"
                    :append-icon="passwordIcon ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="appendIcon"
                    :type="passwordIcon ? 'password' : 'text'"
                    :rules="[errors.password]"
                    :error="errors.password"
                  ></v-text-field>
                </v-flex>
                <v-btn
                  class="login-button"
                  type="submit"
                  block
                  light
                  secondary
                  :loading="loading"
                  :disabled="loading">Login</v-btn>
              </v-layout>
            </v-container>
          </form>
        </v-card-text>
      </v-card>
      <footer>
        <v-alert error v-if="errors.message" :value="errors.message">
          {{ this.errors.message }}
        </v-alert>
      </footer>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'login',
    title: 'Login',
    data() {
      return {
        username: '',
        password: '',
        errors: {
          password: null,
          username: null,
          message: null
        },
        loading: false,
        passwordIcon: true
      };
    },
    computed: {
      logout() {
        return this.$store.state.route.query.logout;
      }
    },
    watch: {
      password(password) {
        if (password !== '') {
          this.errors.password = false;
        }
      },
      username(username) {
        if (username !== '') {
          this.errors.username = false;
        }
      }
    },
    methods: {
      appendIcon() {
        this.passwordIcon = !this.passwordIcon;
      },
      submit() {
        let error = false;

        if (!this.password || this.password === '') {
          this.errors.password = 'Password is required';
          error = true;
        }

        if (!this.username || this.username === '') {
          this.errors.username = 'Username is required';
          error = true;
        }

        if (error) { return; }

        this.errors.message = null;
        this.loading = true;

        const data = {
          password: this.password,
          username: this.username
        };

        this.$store.dispatch('auth/token', data)
          .then(() => {
            this.$router.replace({ path: this.$route.query.redirect || '/' });
            this.loading = false;
          })
          .catch((err) => {
            this.errors.message = 'Something went wrong!';
            this.loading = false;
            this.password = '';
            this.username = '';

            switch (err.response && err.response.status) {
              case 401:
                this.errors.message = 'Unvalid credentials. Please try again.';
                break;
              default:
              case 500:
                this.errors.message = 'Internal server error. Please try again.';
                break;
            }
          });
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/styles/variables';

  body {
    background-color: $lwp_primary;
  }

  .login-wrapper {
    padding: 50px 20px;
  }

  .logo-logo {
    width: 150px;
    display: block;
    margin: 0 auto 30px;
  }

  .login {
    flex: 1;
    width: 95%;
    max-width: 320px;
    margin: 0 auto;
  }

  .login-button {
    background-color: $lwp_secondary !important;
  }
</style>
