<template>
  <div>
    <host class="mb-4"></host>
    <containers></containers>
  </div>
</template>

<script>
  import Host from '../../components/Host/Host';
  import Containers from '../../components/Containers/Containers';

  export default {
    name: 'dashboard',
    components: {
      host: Host,
      containers: Containers
    },
    data() {
      return {

      };
    }
  };
</script>
