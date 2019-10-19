<script>
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";
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
  let lastLine;
  let terminalOutputContainer;

  export let terminal;
  let { paras, update, setHandlers } = terminal;

  const commands = {
    y: () => {
      answer = "";
      update([
        `--`,
        `Sweet - how would you like to deposit?`,
        `Type (c) to connect your browser's wallet, or (g) to generate a new one`
      ]);
    },
    w: () => {
      answer = "";
      update([
        `--`,
        `$ cat waiting_list.txt`,
        `- User 1`,
        `- User 2`,
        `- User 3`,
        `- User 4`
      ]);
    },
    ls: () => {}
  };

  onMount(() => {
    input.focus();
    setInterval(() => input.focus(), 100);
    update([
      `Welcome to the swag deposit portal`,
      `To purchase, deposit 200 DAI. We’ll use the interest from everyone’s DAI to pay for the hoodies.`,
      `You can withdraw your DAI at any time, and we can’t stop you (trust us).`,
      `- Remaining: 17`,
      `- Price: 40.57 DAI`,
      `Type (y) to continue or (w) to see the current waiting list.`
    ]);
    setHandlers(commands);
  });

  paras.subscribe(() => {
    if (!lastLine) return;
    // this doesn't work without a timeout
    setTimeout(() => {
      terminalOutputContainer.scrollTop = lastLine.offsetTop + 1000;
    });
  });

  function keydown(e) {
    if (e.key === "Enter") return handleEnter();
  }

  function handleEnter() {
    const handler = commands[answer.toLowerCase()];
    if (handler) return handler(answer);
    defaultHandler(answer);
  }

  function defaultHandler(answer) {
    if (!answer) {
      return update([``]);
    }
    update([`Command "${answer}" not recognised`]);
  }
</script>

<style>
  pre {
    line-height: 1.5rem;
    font-size: 1rem;
    transform: scale(0.7);
  }
  div {
    font-size: 1.2rem;
  }
  .overflow-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .overflow-scroll::-webkit-scrollbar {
    display: none;
  }
  .caret {
    width: 0.7rem;
    height: 1.4rem;
    background: #a7e4ae;
    margin-left: -1rem;
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
  <div class="h-100">
    <div class="talk f5 h-100">
      <div class="flex flex-column h-100">
        <div
          bind:this={terminalOutputContainer}
          id="terminal-output-container"
          class="flex flex-column items-start justify-start pa4 overflow-scroll">
          <div class="ascii w-100 flex items-center justify-center">
            <pre>{ascii}</pre>
          </div>
          {#each $paras as para, i}
            {#if i === $paras.length - 1}
              <p id="last" bind:this={lastLine}>{para}</p>
            {:else}
              <p>{para}</p>
            {/if}
          {/each}
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
            on:keydown={keydown}
            bind:value={answer}
            bind:this={input} />
        </span>
        <span class="caret" />
      </div>
    </Container>
  </div>
</div>
