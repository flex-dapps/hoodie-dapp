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

  const swagShopAscii = `
 ::::::::  :::       :::     :::      ::::::::        ::::::::  :::    :::  ::::::::  :::::::::
:+:    :+: :+:       :+:   :+: :+:   :+:    :+:      :+:    :+: :+:    :+: :+:    :+: :+:    :+:
+:+        +:+       +:+  +:+   +:+  +:+             +:+        +:+    +:+ +:+    +:+ +:+    +:+
+#++:++#++ +#+  +:+  +#+ +#++:++#++: :#:             +#++:++#++ +#++:++#++ +#+    +:+ +#++:++#+
       +#+ +#+ +#+#+ +#+ +#+     +#+ +#+   +#+#             +#+ +#+    +#+ +#+    +#+ +#+
#+#    #+#  #+#+# #+#+#  #+#     #+# #+#    #+#      #+#    #+# #+#    #+# #+#    #+# #+#
 ########    ###   ###   ###     ###  ########        ########  ###    ###  ########  ###
  `;

  const waitingListAscii = `
:::::::::: :::::::::  ::::::::::: :::::::::: ::::    ::: :::::::::   ::::::::
:+:        :+:    :+:     :+:     :+:        :+:+:   :+: :+:    :+: :+:    :+:
+:+        +:+    +:+     +:+     +:+        :+:+:+  +:+ +:+    +:+ +:+
:#::+::#   +#++:++#:      +#+     +#++:++#   +#+ +:+ +#+ +#+    +:+ +#++:++#++
+#+        +#+    +#+     +#+     +#+        +#+  +#+#+# +#+    +#+        +#+
#+#        #+#    #+#     #+#     #+#        #+#   #+#+# #+#    #+# #+#    #+#
###        ###    ### ########### ########## ###    #### #########   ########
  `;

  const ascii = {
    ASCII_SWAG_SHOP: swagShopAscii,
    ASCII_WAITING_LIST: waitingListAscii
  };

  let answer = "";
  let input;
  let lastLine;
  let terminalOutputContainer;
  let invertedTab = [true, false];

  export let wallet;
  export let terminal;
  let { paras, update, setHandlers, prompt } = terminal;
  let { address, balance, daiBalance } = wallet;

  // @TODO: WELCOME_BACK

  const purchaseFlow = {
    STEP_1: () => {
      update(
        [
          `--`,
          `Sweet - would you like to connect to the wallet in your browser?`
        ],
        () => prompt.set(`Connect? (Y/n)`)
      );
      setHandlers({
        y: () => {
          purchaseFlow["STEP_2"]();
        },
        n: () => {
          printStart();
        },
        _DEFAULT: () => {
          purchaseFlow["STEP_2"]();
        }
      });
    },
    STEP_2: () => {
      update([`Connecting...`], () => prompt.set(`Connecting...`));
      let loadingInterval = printLoading();
      wallet.init({});
      address.subscribe(a => {
        if (!a) return;
        clearInterval(loadingInterval);
        update(
          [
            `Connected!`,
            `Looks like you're using the address ${a}`,
            `ETH Balance: ${Number(get(balance)).toFixed(2)}`,
            `DAI Balance: ${Number(get(daiBalance)).toFixed(2)}`
          ],
          () => prompt.set(`Is this correct? (Y/n)`)
        );

        setHandlers({
          y: () => {
            purchaseFlow["STEP_3"]();
          },
          n: () => {
            update([
              `--`,
              `Well then, we'll have to fix that...`,
              `Select a new wallet and we'll try to detect it automatically.`,
              `Type (s) to see the wallet menu or (r) to refresh`
            ]);
            setHandlers({
              s: () => {
                wallet.init({ showSelect: true });
              },
              r: () => {
                printStart();
              }
            });
          },
          _DEFAULT: () => {
            purchaseFlow["STEP_3"]();
          }
        });
      });
      setHandlers({
        _DEFAULT: () => {
          update([`Wallet not detected, please wait...`]);
        }
      });
    },
    STEP_3: () => {
      update([`--`]);
      if (get(daiBalance) >= 200) {
        update(
          [
            `Great.`,
            `Since hoodies cost a reasonable sum of money, the minimum deposit is 200 DAI.`
          ],
          () => prompt.set(`How much DAI do you want to deposit? (200):`)
        );

        setHandlers({
          y: async () => {
            if (isNaN(Number(answer))) {
              return update([
                `Please enter a number between 200 and ${Math.floor(
                  get(daiBalance).toFixed(1)
                )}`
              ]);
            }
            update([`Depositing ${answer} DAI...`]);
            const loadingInterval = printLoading(500);
            try {
              const { hash, wait } = await wallet.depositDai(Number(answer));
              clearInterval(loadingInterval);
              update([`Transaction: ${hash}`, "Mining, please wait..."]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["DEPOSIT_TX_SUCCEEDED"](tx);
              } else {
                purchaseFlow["DEPOSIT_TX_FAILED"]();
              }
            } catch (e) {
              clearInterval(loadingInterval);
              update(
                [`-- ERROR --`, `USER_DENIED_TRANSACTION_SIGNATURE`],
                purchaseFlow["DEPOSIT_TX_FAILED"]()
              );
            }
          },
          n: () => {},
          _DEFAULT: () => {
            terminal.handlers.y();
          }
        });
      } else {
        update(
          [
            `Unfortunately, you don't have 200 DAI right now.`,
            `It will cost X ETH to purchase the rest of the DAI you need (DAI_TO_PURCHASE).`
          ],
          () =>
            prompt.set(
              `How much DAI do you want to purchase? (DAI_TO_PURCHASE):`
            )
        );

        setHandlers({
          y: async () => {
            if (isNaN(Number(answer))) {
              return update([`Please enter a number between 0 and whatever`]);
            } else if (answer === "whatever") {
              return update([
                `Har har`,
                `Please enter a number between 0 and whatever`
              ]);
            }
            prompt.set(`Purchasing DAI...`);
            update([`Cool, purchasing ${Number(answer)} DAI`]);
            const loadingInterval = printLoading(500);
            try {
              const { hash, wait } = await wallet.purchaseDai(Number(answer));
              clearInterval(loadingInterval);
              update([`Transaction: ${hash}`, "Mining, please wait..."]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["SWAP_TX_SUCCEEDED"](tx);
              } else {
                purchaseFlow["SWAP_TX_FAILED"]();
              }
            } catch (e) {
              clearInterval(loadingInterval);
              update([`-- ERROR --`, `USER_DENIED_TRANSACTION_SIGNATURE`], () =>
                purchaseFlow["SWAP_TX_FAILED"]()
              );
            }
          },
          n: () => {
            update([`Okay.`], printStart);
          },
          _DEFAULT: () => {
            terminal.handlers.y();
          }
        });
      }

      // get dai balance

      // does the user have enough DAI?

      // does the user have enough ether to purchase enough DAI?
    },
    SWAP_TX_SUCCEEDED: tx => {
      // the swap has succeeded, now deposit the money
      purchaseFlow["STEP_3"]();
    },
    SWAP_TX_FAILED: () => {
      update(
        [`Transaction error, nuking the process...`, ``, ``, ``, ``, ``],
        () => {
          printStart();
          prompt.set(``);
        }
      );
    }
  };

  const commands = {
    y: () => {
      purchaseFlow["STEP_1"]();
    },
    w: () => {
      update([
        `ASCII_WAITING_LIST`,
        `- User 4`,
        `- User 3`,
        `- User 2`,
        `- User 1`,
        `--`,
        `Type (y) to continue or (w) to see the current waiting list.`
      ]);
    },
    _DEFAULT: () => {
      purchaseFlow["STEP_1"]();
    },
    ls: () => {}
  };

  function printStart() {
    setHandlers(commands);
    update(
      [
        `ASCII_SWAG_SHOP`,
        `Welcome to the swag deposit portal`,
        `To purchase, deposit 200 DAI. We’ll use the interest from everyone’s DAI to pay for the hoodies.`,
        `You can withdraw your DAI at any time, and we can’t stop you (trust us).`,
        `- Remaining: 17`,
        `- Price: 40.57 DAI`,
        `Type (y) to continue or (w) to see the current waiting list.`
      ],
      () => prompt.set("(Y/w):")
    );
  }

  function printLoading(interval) {
    let index = 0;
    let loadingInterval = setInterval(() => {
      let i = 0;
      let string = "-";
      while (i < index) {
        string += `-`;
        i++;
      }
      index++;
      update([string]);
    }, interval | 250);
    return loadingInterval;
  }

  onMount(() => {
    input.focus();
    setInterval(() => input.focus(), 100);
    printStart();
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
    const handler = terminal.handlers[answer.toLowerCase()];
    if (handler) {
      handler(answer);
    } else if (terminal.handlers[terminal.DEFAULT_HANDLER_KEY]) {
      terminal.handlers[terminal.DEFAULT_HANDLER_KEY]();
    } else {
      terminal.defaultHandler(answer);
    }
    answer = "";
  }
</script>

<style>
  pre {
    line-height: 1.5rem;
    font-size: 1rem;
    transform: scale(0.7);
  }
  div {
    font-size: 1.5rem;
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
      <Container inverted={invertedTab[0]} bottom={true}>
        <div class="h-100 flex items-center justify-start pa3">
          ./buy_swag.sh
        </div>
      </Container>
    </div>
    <div class="w-50">
      <Container inverted={invertedTab[1]} bottom={true}>
        <div class="h-100 flex items-center justify-end pa3">{$address}</div>
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
          {#each $paras as para, i}
            {#if i === $paras.length - 1}
              <p id="last" bind:this={lastLine}>{para}</p>
            {:else if para.indexOf('ASCII') === 0}
              <div class="ascii w-100 flex items-center justify-center">
                <pre>{ascii[para]}</pre>
              </div>
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
        <span>$ {$prompt}</span>
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
