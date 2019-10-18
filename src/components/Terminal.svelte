<script>
  import { onMount } from "svelte";
  import { Container } from "./";

  // need tabs
  // need terminal text
  // need input bar

  // should be
  /*
    <Tabs />
    <Content />
    <Input />
  */

  const ascii = `
 ::::::::  :::       :::     :::      ::::::::        ::::::::  :::    :::  ::::::::  :::::::::
:+:    :+: :+:       :+:   :+: :+:   :+:    :+:      :+:    :+: :+:    :+: :+:    :+: :+:    :+:
+:+        +:+       +:+  +:+   +:+  +:+             +:+        +:+    +:+ +:+    +:+ +:+    +:+
+#++:++#++ +#+  +:+  +#+ +#++:++#++: :#:             +#++:++#++ +#++:++#++ +#+    +:+ +#++:++#+
       +#+ +#+ +#+#+ +#+ +#+     +#+ +#+   +#+#             +#+ +#+    +#+ +#+    +#+ +#+
#+#    #+#  #+#+# #+#+#  #+#     #+# #+#    #+#      #+#    #+# #+#    #+# #+#    #+# #+#
 ########    ###   ###   ###     ###  ########        ########  ###    ###  ########  ###
  `;

  let answer = "";
  let input;

  onMount(() => {
    input.focus();
  });
</script>

<style>
  pre {
    line-height: 1.5rem;
    font-size: 1rem;
    transform: scale(0.8);
  }
  div {
    font-size: 1.5rem;
  }
  .caret {
    width: 0.7rem;
    height: 1.4rem;
    background: #a7e4ae;
    margin-left: -1.2rem;
  }
  input,
  input:active,
  input:focus {
    background: none;
    color: transparent;
    text-shadow: 0 0 0 #a7e4ae;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
  }
</style>

<div class="h-100 w-100 flex flex-column justify-between">
  <div class="w-100 flex h3">
    <div class="w-50">
      <Container inverted={true} bottom={true}>
        <div class="h-100 flex items-center justify-start pa3">
          ./buy_swag.shell
        </div>
      </Container>
    </div>
    <div class="w-50">
      <Container bottom={true}>
        <div class="h-100 flex items-center justify-start pa3">
          waiting_list.txt
        </div>
      </Container>
    </div>
  </div>
  <div>
    <div class="talk f5">
      <div class="flex flex-column h-100">
        <div class="ascii w-100 flex items-center justify-center">
          <pre>{ascii}</pre>
        </div>
        <div class="flex flex-column items-start justify-center pa4">
          <p>Welcome to the swag deposit portal</p>
          <p>
            To purchase, deposit 200 DAI. We’ll use the interest from everyone’s
            DAI to pay for the hoodies.
          </p>
          <p>
            You can withdraw your DAI at any time, and we can’t stop you (trust
            us).
          </p>
          <div>
            <div>- Remaining: 17</div>
            <div>- Price: 40.57 DAI</div>
          </div>
          <p>Type (y) to continue or (w) to see the current waiting list.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="h3 w-100 flex">
    <Container top={true}>
      <div class="w-100 h-100 flex items-center pa3">
        <span>$ purchase (y/N):</span>
        <span class="ml3">
          <input
            size={answer.length + 1}
            type="text"
            bind:value={answer}
            bind:this={input} />
        </span>
        <span class="caret" />
      </div>
    </Container>
  </div>
</div>
