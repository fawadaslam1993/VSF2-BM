<template>
  <div id="fawad-aslam">
    My name is Fawad and I am a VUE JS Dev!<br>
    `{{ fawad }}` this is static value.<br>
    <button @click="fawadTestFunction">
      Static Method Call in VSF2
    </button><br>
    <button @click="fawadCustomApiMethod">
      Composable Method
    </button><br>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
} from '@nuxtjs/composition-api';

import { useFawadStore } from '~/modules/fawad/store/fawadStore';
import useFawad from '~/modules/fawad/composables/useFawad';

export default defineComponent({
  name: 'VueJsDev',
  setup() {
    const fawadStore = useFawadStore();
    const { fawadCustomApiMethod } = useFawad();
    const fawadTestFunction = () => {
      console.log('This is test function in VSF2');
    };
    onMounted(() => {
      console.log('ON MOUNTED');
    });

    return {
      fawad: fawadStore.fawad.designation,
      fawadTestFunction,
      fawadCustomApiMethod,
    };
  },
});
</script>

  <style lang="scss" scoped>
  #fawad-aslam {
    display: block;
  }
  </style>
