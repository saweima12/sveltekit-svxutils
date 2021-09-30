<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import type { SourcePage, SourcePageContext } from "$lib/index";
  export const load : Load = async ( { fetch } ) => {
    let res = await fetch('./test.json')
    if (res.ok) {
      let { page, context } = await res.json();
      return {
        status: 200, props: { page, context }
      };
    }

    return {
      status: 500 
    }
  }
</script>

<script lang="ts">
  export let page: SourcePage;
  export let context: SourcePageContext;
</script>

<h1> {page.frontMatter.title} </h1>

<svelte:head>
{@html context.head}
</svelte:head>


{@html context.html}

{@html context.style}
