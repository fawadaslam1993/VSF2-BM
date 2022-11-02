<template>
  <div >
    <div class="container mx-auto">
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
    >
      <template #logo>
        <HeaderLogo />
      </template>
      <template #header-icons="{ activeIcon }">
        <div class="sf-header__icons mobile-only:flex items-center mobile-only:pr-[12px]">
          <div class="lg:ml-11 md:ml-8 mobile-only:ml-0 mobile-only:w-[14vw] cursor-pointer flex flex-col items-center gap-1">
            <nuxt-link :to="localePath('/showrooms_info')">
               <img class="w-6 h-6 mobile-only:h-[20px] w-[27px] h-[20px] mt-1.5" src="../static/icons/location.svg">
            </nuxt-link>
            <p class="text-xs text-[#54575b] font-['Poppins'] Minitab-only:text-[0.625rem] Tab-only:hidden">Showroom</p>
          </div>
          <div class="lg:ml-11 md:ml-8 mobile-only:ml-0 mobile-only:w-[14vw]">
            <PhoneNumber :identifiers="PhoneNumber" />
          </div>
          <div class="lg:ml-11 md:ml-8 mobile-only:ml-0 mobile-only:w-[14vw] cursor-pointer flex flex-col items-center gap-1">
            <img class="w-6 h-6 mobile-only:h-[20px] w-[27px] h-[20px] mt-1.5" @click="handleAccountClick" src="../static/icons/user.svg">
            <p class="text-xs text-[#54575b] font-['Poppins'] Minitab-only:text-[0.625rem] Tab-only:hidden">Account</p>
          </div>
          <div class="lg:ml-11 md:ml-8 mobile-only:ml-0 cursor-pointer mt-[-8px] flex flex-col items-center gap-1">
            <img class="w-7 h-7 w-[27px] h-[20px] mt-2" @click="toggleCartSidebar" src="../static/icons/basket.svg">
            <p class="text-xs text-[#54575b] font-['Poppins'] Minitab-only:text-[0.625rem] Tab-only:hidden">Basket</p>
          </div>
          <!--          <SfButton-->
          <!--            v-e2e="'app-header-account'"-->
          <!--            class="sf-button&#45;&#45;pure sf-header__action"-->
          <!--            data-testid="accountIcon"-->
          <!--            aria-label="Account"-->
          <!--            @click="handleAccountClick"-->
          <!--          >-->
          <!--            <SvgImage-->
          <!--              :icon="accountIcon"-->
          <!--              :label="$t('Account')"-->
          <!--              width="1.25rem"-->
          <!--              height="1.25rem"-->
          <!--              :class="{-->
          <!--                'sf-header__icon is-active': activeIcon === 'account',-->
          <!--              }"-->
          <!--            />-->
          <!--          </SfButton>-->
          <SfButton
            v-if="isAuthenticated"
            class="sf-button--pure sf-header__action"
            data-testid="wishlistIcon"
            aria-label="Wishlist"
            @click="toggleWishlistSidebar"
          >
            <SvgImage
              :icon="wishlistHasProducts ? 'heart_fill' : 'heart'"
              :label="$t('Wishlist')"
              width="1.25rem"
              height="1.25rem"
              class="sf-header__icon"
              :class="{
                'sf-header__icon is-active': activeIcon === 'wishlist',
              }"
            />
            <SfBadge
              v-if="wishlistHasProducts"
              class="sf-badge--number cart-badge"
            >
              {{ wishlistItemsQty }}
            </SfBadge>
          </SfButton>
          <!--          <SfButton-->
          <!--            v-e2e="'app-header-cart'"-->
          <!--            class="sf-button&#45;&#45;pure sf-header__action"-->
          <!--            aria-label="Toggle cart sidebar"-->
          <!--            @click="toggleCartSidebar"-->
          <!--          >-->
          <!--            <SvgImage-->
          <!--              icon="empty_cart"-->
          <!--              :label="$t('Cart')"-->
          <!--              width="20"-->
          <!--              height="20"-->
          <!--              class="sf-header__icon"-->
          <!--              :class="{-->
          <!--                'sf-header__icon is-active': activeIcon === 'cart',-->
          <!--              }"-->
          <!--            />-->
          <!--            <SfBadge-->
          <!--              v-if="cartTotalItems"-->
          <!--              class="sf-badge&#45;&#45;number cart-badge"-->
          <!--            >-->
          <!--              {{ cartTotalItems }}-->
          <!--            </SfBadge>-->
          <!--          </SfButton>-->
        </div>
      </template>
      <template #search>
        <SearchBar
          :is-search-open="isSearchOpen"
          @set-is-open="isSearchOpen = $event"
          @set-search-results="productSearchResults = $event"
        />
      </template>
    </SfHeader>
    <SearchResults
      v-if="isSearchOpen"
      :visible="isSearchOpen"
      :search-results="productSearchResults"
      @close="isSearchOpen = false"
    />
    <SfOverlay :visible="isSearchOpen" />
</div>
    <div class="" id="">
      <ContentDesktopMenuBlocks
        :identifiers="desktopMainMenuIdentifier"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  SfOverlay, SfHeader, SfButton, SfBadge,
} from '@storefront-ui/vue';
import PhoneNumber from "~/components/PhoneNumber.vue";
import {
  computed,
  ref,
  defineComponent,
  useRouter,
  useContext,
  onMounted,
  useFetch,
} from '@nuxtjs/composition-api';
// import HeaderNavigation from '~/components/Header/Navigation/HeaderNavigation.vue';
import { useCategory } from '~/modules/catalog/category/composables/useCategory';
import {
  useUiHelpers,
  useUiState,
} from '~/composables';
import { useCart } from '~/modules/checkout/composables/useCart';
import { useWishlist } from '~/modules/wishlist/composables/useWishlist';
import { useUser } from '~/modules/customer/composables/useUser';
import { useWishlistStore } from '~/modules/wishlist/store/wishlistStore';
import type { CategoryTree, ProductInterface } from '~/modules/GraphQL/types';
import HeaderLogo from '~/components/HeaderLogo.vue';
import SvgImage from '~/components/General/SvgImage.vue';
import { useTopBar } from './TopBar/useTopBar';
import ContentDesktopMenuBlocks from '~/components/ContentDesktopMenuBlock.vue';

export default defineComponent({
  components: {
    // HeaderNavigation,
    PhoneNumber,
    SfHeader,
    SfOverlay,
    HeaderLogo,
    SvgImage,
    SfButton,
    SfBadge,
    ContentDesktopMenuBlocks,
    CurrencySelector: () => import('~/components/CurrencySelector.vue'),
    StoreSwitcher: () => import('~/components/StoreSwitcher.vue'),
    SearchBar: () => import('~/components/Header/SearchBar/SearchBar.vue'),
    SearchResults: () => import(
      /* webpackPrefetch: true */ '~/components/Header/SearchBar/SearchResults.vue'
    ),
  },
  setup() {
    const router = useRouter();
    const { app } = useContext();
    const { toggleCartSidebar, toggleWishlistSidebar, toggleLoginModal } = useUiState();
    const { setTermForUrl, getCatLink } = useUiHelpers();
    const { isAuthenticated } = useUser();
    const { loadTotalQty: loadCartTotalQty, cart } = useCart();
    const { loadItemsCount: loadWishlistItemsCount } = useWishlist();
    const { categories: categoryList, load: categoriesListLoad } = useCategory();

    const { hasCurrencyToSelect, hasStoresToSelect } = useTopBar();

    const isSearchOpen = ref(false);
    const productSearchResults = ref<ProductInterface[] | null>(null);

    const wishlistStore = useWishlistStore();
    const wishlistItemsQty = computed(() => wishlistStore.wishlist?.items_count ?? 0);

    const wishlistHasProducts = computed(() => wishlistItemsQty.value > 0);
    const accountIcon = computed(() => (isAuthenticated.value ? 'profile_fill' : 'profile'));
    const categoryTree = ref<CategoryTree[]>([]);

    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        await router.push(app.localeRoute({ name: 'customer-my-profile' }));
      } else {
        toggleLoginModal();
      }
    };
    const desktopMainMenuIdentifier = ref(['megamenubathroom']);
    const PhoneNumber = ref(['phone-number']);

    useFetch(async () => {
      await categoriesListLoad({ pageSize: 20 });

      categoryTree.value = categoryList.value?.[0]?.children
        .filter((category) => category.include_in_menu);
    });

    onMounted(async () => {
      if (app.$device.isDesktop) {
        await loadCartTotalQty();
        // eslint-disable-next-line promise/catch-or-return
        await loadWishlistItemsCount();
      }
    });

    return {
      accountIcon,
      cartTotalItems: computed(() => cart.value?.total_quantity ?? 0),
      categoryTree,
      getCatLink,
      handleAccountClick,
      isAuthenticated,
      isSearchOpen,
      productSearchResults,
      setTermForUrl,
      toggleCartSidebar,
      toggleWishlistSidebar,
      wishlistHasProducts,
      wishlistItemsQty,
      hasCurrencyToSelect,
      hasStoresToSelect,
      desktopMainMenuIdentifier,
      PhoneNumber
    };
  },
});
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0 var(--spacer-sm);
  }

  &__switchers {
    display: flex;
  }
}

.header-on-top {
  z-index: 2;
}

.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
</style>
<style lang="scss">
  .sf-header__navigation{
    --header-navigation-margin: unset !important;
  }
  .sf-header--has-mobile-search, .sf-header--has-mobile-navigation {
    --header-box-shadow: none;
}
  .sf-header__actions{
    @media (min-width: 1024px) {
      justify-content: end !important;
      align-items: center;
      margin-right: 24px;
    }
    @media (min-width: 768px) and (max-width: 1023px){
      flex-wrap: nowrap;
    }
    @media (max-width: 768px) {
      padding-right: 6px;
    }
  }
  .sf-header--has-mobile-search{
    .sf-header__header{
      padding: 0;
      @media (max-width: 768px) {
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 0;
      }
    }
     .sf-header__logo{
       @media (max-width: 768px) {
       .sf-image {
         width: 94px;
         min-height: 45px;
         object-fit: fill;
         padding-left: 14px;
         width: 100%;
       }
      }
    }
    @media (min-width: 768px){
    .sf-header__icons{
      /*@media (min-width: 1024px){*/
        display: flex !important;
      /*}*/
    }
    /*@media (max-width: 1024px) {*/
    .sf-header__search {
      --header-search-flex: 0 1 19.875rem;
      /*}*/
    }
      .sf-header__header{
      flex-wrap: nowrap;
    }
    }
  }
  input#search{
    height: 2.625rem;
    border-radius: 3px;
    width: 100%;
    border: 1px solid #bfc3cb;
    font-size: 0.839375rem;
    padding-left: 0.5rem;
    margin-top: 5px;
  @media (min-width: 1280px) {
    min-width: 430px;
  }
  @media (min-width: 1024px) and (max-width: 1279px){
    min-width: 330px;
  }
  @media (min-width: 992px) and (max-width: 1024px){
    max-width: 250px;
    margin-left: 65px;
  }
  @media (min-width: 768px) and (max-width: 991px){
    margin-left: 70px;
  }
}
</style>

