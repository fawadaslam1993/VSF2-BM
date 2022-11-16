import { ref, useContext } from '@nuxtjs/composition-api';
import { Logger } from '~/helpers/logger';
import { useFawadStore } from '~/modules/fawad/store/fawadStore';
import type {
  UseFawadErrors,
  UseFawadInterface,
} from '~/modules/fawad/composables/useFawad/useFawad';

/**
 *
 * See the {@link UseFawadInterface} for a list of methods and values available in this composable.
 */
export function useFawad(): UseFawadInterface {
  const fawadStore = useFawadStore();
  const { app } = useContext();
  const loading = ref(false);
  const error = ref<UseFawadErrors>({
    fawadCustomApiMethod: null,
  });

  const fawadCustomApiMethod = async (): Promise<number | null> => {
    console.log('Inside composable method');
    let itemsCount : number | null = null;

    try {
      loading.value = true;
      error.value.fawadCustomApiMethod = null;
      const { data } = await app.context.$vsf.$magento.api.fawadApi();
      Logger.debug('[Result]:', { data });
      itemsCount = 100;
      fawadStore.$patch((state) => {
        console.log('State is :', state);
        state.fawad.designation = 'Tilemountain';
      });
    } catch (err) {
      error.value.fawadCustomApiMethod = err;
    } finally {
      loading.value = false;
    }

    return itemsCount;
  };

  return {
    fawadCustomApiMethod,
  };
}

export default useFawad;
export * from './useFawad';
