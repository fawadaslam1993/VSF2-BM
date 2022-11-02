<template>
    <div class="phone flex flex-col items-center gap-2">
      <a  :href="PhoneNumberLink" class="contact flex">
         <img src="../static/icons/phone.svg" alt="icon" class="w-6 mobile-only:w-5 w-[27px] h-[20px] mt-1.5">
      </a>
      <p class="text-xs text-[#54575b] font-['Poppins'] Minitab-only:text-[0.625rem] Tab-only:hidden">{{ PhoneNumberText }}</p>
    </div>
  </template>
  <script lang="ts">
  import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api';
  import type { PropType } from '@nuxtjs/composition-api';
  import { useContent } from '~/composables';
  import type { CmsBlock } from '~/modules/GraphQL/types';
  import ContentBlock from './ContentBlock.vue';
  import { parse } from 'node-html-parser';
  
  export default defineComponent({
    name: 'PhoneNumber',
    components: {
      ContentBlock,
    },
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
      const PhoneNumberText = ref(null);
      const PhoneNumberLink = ref(null);
      useFetch(async () => {
        if (props.identifiers) {
          blocks.value = await loadBlocks({ identifiers: props.identifiers });
          console.log('this is number3', blocks.value)
          const PhoneData = blocks && blocks.value && blocks.value.length > 0 && blocks.value[0].content ? blocks.value[0].content : '';
          console.log('this is number4', PhoneData)
          var number = '0';
          var link = '';
          if (PhoneData && PhoneData !== 'null' && PhoneData !== 'undefined') {
            console.log('this is number', PhoneData)
            var parsedDesktopMenuOriginalContent = parse(PhoneData);
            number = parsedDesktopMenuOriginalContent.querySelector('p').rawText;
            link = parsedDesktopMenuOriginalContent.querySelector('a').attributes['href'];
            console.log('43213', number)
          }
          PhoneNumberText.value = number;
          PhoneNumberLink.value = link
          console.log('this is number2', typeof PhoneNumberText.value)
        }
      });
  
      return {
        blocks,
        PhoneNumberText,
        PhoneNumberLink
      };
    },
  });
  </script>
  