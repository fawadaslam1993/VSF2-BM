<template>
    <div class="phone">
      <a  :href="PhoneNumberLink" class="contact flex">
         <img src="../static/icons/phone.svg" alt="icon" class="w-6 mobile-only:w-5">
      </a>
      <p class="font-sans ml-0 text-gray-800 mobile-only:hidden text-xs text-[#54575b]">{{ PhoneNumberText }}</p>
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
  