<script>
  import { onMount } from "svelte";
  import providedWallet from "./stores/provided-wallet";

  import { terminal } from "./stores";
  import { Container, Terminal, Product } from "./components";

  onMount(() => {
    providedWallet.init(window.web3);
  });

  let state;
</script>

<style>
  div {
    background: #2a333e;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css" />

  <link rel="stylesheet" href="/custom.css" />
</svelte:head>

<div class="w-100 h-100 pa3">
  <Container>
    <div class="flex justify-between w-100 h-100">
      <div class="w-50 h-100">
        <Container right={true}>
          <Terminal bind:state {terminal} />
        </Container>
      </div>
      <div class="w-50 h-100">
        <Product bind:state />
      </div>
    </div>
  </Container>
</div>
