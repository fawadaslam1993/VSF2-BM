<template>
  <nav>
    <div class=" max-[991px]:block hidden mt-6">
      <span class=" inline-block bg-[#f2f2f2] px-[10px] py-[7px]">
        <img class="w-6 h-6" src="../static/icons/icon-hamburger.svg">
      </span>
    </div>
    <div class="bg-siteColor hidden min-[992px]:block">
      <div class="container mx-auto relative">
        <ul class="flex menu">
          <li
            v-for="links in cmsBlockDataAfterParsing"
            :key="links"
            class="basis-[auto] flex-grow flex-shrink group sb-menu nav-item level0 nav-1 level-top first nav-item--parent mega nav-item--only-blocks parent bg-[#54575b] last:bg-[#CA0200] last:relative last:right-0.5"
          >
            <nuxt-link
              :to="localePath(links.link)"
              class="font-['Poppins', sans-serif] text-base font-normal uppercase level-top sb-forward text-center block text-white md:text-tm Tab-only:text-tm border-r border-[#fff] border-solid my-2.5 Desktop-only:text-xs Minitab-only:text-[0.625rem] Minitab-only:leading-4	last:border-0"
            >{{ links.title }}</nuxt-link>
            <div v-if="links.submenu" class="nav-panel-dropdown group-hover:block hidden nav-panel-dropdown z-50 bg-white w-full absolute bg-white left-0 group-hover:block w-full absolute bg-white hidden left-0 container">
              <div class="nav-panel-inner">
                <div class="nav-block flex gap-2 columns-5">
                  <div
                    v-for="sublink in links.submenu"
                    :key="sublink"
                    class="col-lg-2 col-md-2 px-2 py-3 min-h-[280px] border-[#eeeeee] border-r-2 h-[276px] w-[16%] sb-height-dropdown-menu last:border-none my-2.5"
                  >
                    <span class="subcag-title xl:text-sm capitalize text-siteColor font-bold font-['Poppins', sans-serif] Desktop-only:text-xs Minitab-only:text-xs">{{ sublink.main_title }}</span>
                    <ul class="bullet mt-1">
                      <li class="leading-[1rem]" v-for="finallink in sublink.sub_links" :key="finallink">
                        <nuxt-link :to="localePath(finallink.link)"
                        class="text-xs hover:text-[#5bd2ec] font-['Poppins', sans-serif] Minitab-only:text-[10px]">
                        {{ finallink.title }}
                        </nuxt-link >
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="sb-price-match bg-[#939598] flex justify-end w-[84.5%] Minitab-only:w-full">
                  <div class="menu-dropdown-logo-img h-14">&nbsp;</div>
                </div>
                <div v-if="links.submenuimg" class="dropdown-menu-right-img absolute right-0 top-0 z-10 h-full Minitab-only:hidden  w-[200px]">
                  <a>
                    <img class="w-full h-full object-cover" :src="links.submenuimg" :alt="links.title"/>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    
  </template>
  <script lang="ts">
  import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api';
  import type { PropType } from '@nuxtjs/composition-api';
  import { parse } from 'node-html-parser';
  import { useContent } from '~/composables';
  import type { CmsBlock } from '~/modules/GraphQL/types';
  
  export default defineComponent({
    name: 'ContentDesktopMenuBlocks',
    components: {},
    props: {
      identifiers: {
        type: Array as PropType<string[]>,
        required: true,
      },
    },
    setup(props) {
      const {
        loadBlocks,
      } = useContent();
      const blocks = ref<CmsBlock[]>([]);
      const cmsBlockDataAfterParsing = ref(null);
  
      useFetch(async () => {
      if (props.identifiers) {
        blocks.value = await loadBlocks({ identifiers: props.identifiers });
        const DesktopMenuParsedContentOriginal = blocks && blocks.value && blocks.value.length > 0 && blocks.value[0].content ? blocks.value[0].content : '';
        console.log('DesktopMenuParsedContentOriginal value is', DesktopMenuParsedContentOriginal);
        if (DesktopMenuParsedContentOriginal && DesktopMenuParsedContentOriginal !== 'null' && DesktopMenuParsedContentOriginal !== 'undefined') {
          const parsedDesktopMenuOriginalContent = parse(DesktopMenuParsedContentOriginal);
          console.log('parsedDesktopMenuOriginalContent :', parsedDesktopMenuOriginalContent);
          if (parsedDesktopMenuOriginalContent) {
            const mainTopLinks = [];
            let i = 0;
            const mbclasses = parsedDesktopMenuOriginalContent.querySelectorAll('.sb-menu');
            // console.log(`mbclasses - ${i}`, mbclasses);
            Array.prototype.forEach.call(mbclasses, (mbclass) => {
                     // do whatever
          // console.log('class - ' + i, mbclass);
          const menulink = {} as any;
          if (mbclass.querySelector('a.sb-forward').attributes['href']) {
            menulink.link = mbclass.querySelector('a.sb-forward').attributes[
              'href'
              ];
              console.log("this is bangash", mbclass.querySelector('a.sb-forward').attributes['href'])
          } else {
            menulink.link = '#';
          }
          if (mbclass.querySelector('a.sb-forward').rawText) {
            menulink.title = mbclass.querySelector('a.sb-forward').rawText;
          } else {
            menulink.title = 'UnDefined';
          }

          let issubmenu = false;
          let submenuimg = false;

          if (mbclass.querySelector('.nav-panel-dropdown')) {
            var totalsubmenublocks = 0;
            var blockiterator = 0;
            const submenublockselements = mbclass.querySelectorAll(
              '.sb-height-dropdown-menu'
            );
            if (submenublockselements.length) {
              issubmenu = true;
              totalsubmenublocks = submenublockselements.length;

              var allsubmenublocks = [] as any;
              [].forEach.call(submenublockselements, submenublockelement => {
                const submenublockls = {} as any;
                const submenublocklinks = [];

                if (submenublockelement.querySelector('.subcag-title').rawText) {
                  submenublockls.main_title = submenublockelement.querySelector(
                    '.subcag-title'
                  ).rawText;
                } else {
                  submenublockls.main_title = 'UnDefined';
                }

                // submenublockls.main_title = subblocktitle;

                let bulletul = submenublockelement.querySelector('ul.bullet');
                let bulletullis = bulletul.querySelectorAll('li');
                let bulletlicount = 0;

                Array.prototype.forEach.call(bulletullis, bulletulli => {
                  const submenulink = {} as any;

                  const bulletullianchor = bulletulli.querySelector('a');
                  if (bulletullianchor && bulletullianchor.attributes['href']) {
                    submenulink.link = bulletullianchor.attributes['href'];
                  } else {
                    submenulink.link = '#';
                  }

                  if (bulletullianchor && bulletullianchor.rawText) {
                    submenulink.title = bulletullianchor.rawText;
                  } else {
                    submenulink.title = 'UnDefined';
                  }

                  submenublocklinks[bulletlicount] = submenulink;

                  bulletlicount++;
                });

                submenublockls.sub_links = submenublocklinks;
                allsubmenublocks[blockiterator] = submenublockls;
                blockiterator++;
              });

              if (mbclass.querySelector('img')) {
                submenuimg = mbclass.querySelector('img').attributes['src'];
              }
            }
            // console.log('Total subblocks ' + totalsubmenublocks);
          }

          if (issubmenu) {
            // console.log('Submenuhtml', allsubmenublocks);
            menulink['submenu'] = allsubmenublocks;
          }

          if (submenuimg) {
            menulink['submenuimg'] = submenuimg;
          }
          mainTopLinks[i] = menulink;
          i++;
          console.log("tihs is i here", i)
        });
            if (mainTopLinks && mainTopLinks.length > 0) {
              console.log('cmsBlockDataAfterParsing', mainTopLinks);
              cmsBlockDataAfterParsing.value = mainTopLinks;
            }
          }
        }
      }
    });
  
      return {
        blocks,
        cmsBlockDataAfterParsing,
      };
    },
  });
  </script>
  