<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import { terminal, wallet } from "./stores";
  import { Container, Terminal, Product } from "./components";

  import uuid from "uuid";

  let state;
  let transactions = writable([]);
  wallet.txCallback.set(tx => {
    transactions.update(t => {
      // tx.id = uuid.v4();
      t.push("{");
      for (let key in tx.transaction) {
        t.push(`  ${key}: ${tx.transaction[key]}`);
      }
      t.push("}");
      return t;
    });
  });
</script>

<style>
  div {
    background: #2a333e;
  }
  @media only screen and (max-width: 1072px) {
    .app {
      flex-direction: column-reverse;
    }
    .app > div {
      width: 100%;
      height: 100%;
    }
    .product {
      display: none;
    }
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
    <div class="flex justify-between w-100 h-100 app">
      <div class="w-50 h-100">
        <Container right={true}>
          <Terminal bind:state {terminal} {wallet} />
        </Container>
      </div>
      <div class="w-50 h-100 product">
        <Product bind:state bind:transactions />
      </div>
    </div>
  </Container>
</div>
