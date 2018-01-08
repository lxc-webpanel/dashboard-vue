<template>
  <v-flex md3 sm6 xs12 class="mb-3">
    <v-card class="host-card white--text" :class="statusClassName" height="100px">
      <v-icon class="white--text" left>{{ icon }}</v-icon>
      <host-card-progress v-if="unit" :value="value"></host-card-progress>
      <v-card-text class="valign-wrapper" v-if="value">
        <div class="valign">
          <span class="host-card-value">{{ value }}{{ unit }}</span>
          <span class="host-card-label">{{ label }}</span>
        </div>
        <div class="host-card-extras valign-wrapper" :class="statusClassName">
          <ul :class="extrasClassName" v-for="extra in extras">
            <li v-for="e in extra"><span>{{ e.label }}:</span> {{ e.value }}{{ e.unit }}</li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  import HostCardProgress from './HostCardProgress';
  import { info, getResourcesStatusColorClassName } from '../../libraries/utils/colors';

  export default {
    name: 'host-card',
    props: ['value', 'label', 'icon', 'extras', 'unit'],
    components: {
      'host-card-progress': HostCardProgress
    },
    computed: {
      extrasClassName() {
        return this.extras.length > 1 ? 'host-card-extras-two-up' : '';
      },
      statusClassName() {
        return this.unit ? getResourcesStatusColorClassName(this.value, 'light') : info.light;
      }
    }
  };
</script>

<style lang="scss">
  .host-card {
    position: relative;
    height: 100px;
    overflow: hidden;

    color: #FFFFFF;
    cursor: help;
    transition: background-color .3s;

    &:hover {
      .host-card-extras {
        opacity: 1;
      }
    }

    &-value {
      font-size: 24px;
    }

    &-label {
      display: block;

      font-size: 14px;
      font-weight: 300;
    }

    &-extras {
      padding: 0 20px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;

      opacity: 0;
      transition: opacity .3s;
      color: #FFFFFF;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        font-size: 13px;
      }

      li span {
        font-weight: 600;
      }

      &-two-up {
        position: relative;
        padding: 0;
        width: 50%;
        float: left;

        &-wrapper {
          padding: 0 20px;
          width: 100%;
          height: 100%;
        }

        &:first-child {
          padding-right: 20px;
        }

        &:last-child {
          padding-left: 20px;

          &:before {
            content: '';
            position: absolute;
            height: 120%;
            width: 1px;
            top: -10%;
            left: 0;

            background-color: #FFFFFF;
          }
        }
      }
    }

   .icon {
      position: absolute;
      bottom: -35px;
      right: 0px;
      font-size: 130px;
    }
  }
</style>
