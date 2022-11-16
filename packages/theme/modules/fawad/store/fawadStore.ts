import { defineStore } from 'pinia';
import type { Fawad } from '~/modules/GraphQL/types';

interface FawadState {
  fawad: Fawad,
}

export const useFawadStore = defineStore('fawad', {
  state: (): FawadState => ({
    fawad: { designation: 'Wordpress' },
  }),
});
