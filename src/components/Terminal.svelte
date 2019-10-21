<script>
  import ethers from "ethers";
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

  const MINIMUM_DAI_REQUIRED = 1;

  const swagShopAscii = `
 ::::::::  :::       :::     :::      ::::::::        ::::::::  :::    :::  ::::::::  :::::::::
:+:    :+: :+:       :+:   :+: :+:   :+:    :+:      :+:    :+: :+:    :+: :+:    :+: :+:    :+:
+:+        +:+       +:+  +:+   +:+  +:+             +:+        +:+    +:+ +:+    +:+ +:+    +:+
+#++:++#++ +#+  +:+  +#+ +#++:++#++: :#:             +#++:++#++ +#++:++#++ +#+    +:+ +#++:++#+
       +#+ +#+ +#+#+ +#+ +#+     +#+ +#+   +#+#             +#+ +#+    +#+ +#+    +#+ +#+
#+#    #+#  #+#+# #+#+#  #+#     #+# #+#    #+#      #+#    #+# #+#    #+# #+#    #+# #+#
 ########    ###   ###   ###     ###  ########        ########  ###    ###  ########  ###
  `;

  const welcomeAscii = `
:::       ::: :::::::::: :::        ::::::::   ::::::::  ::::    ::::  ::::::::::
:+:       :+: :+:        :+:       :+:    :+: :+:    :+: +:+:+: :+:+:+ :+:
+:+       +:+ +:+        +:+       +:+        +:+    +:+ +:+ +:+:+ +:+ +:+
+#+  +:+  +#+ +#++:++#   +#+       +#+        +#+    +:+ +#+  +:+  +#+ +#++:++#
+#+ +#+#+ +#+ +#+        +#+       +#+        +#+    +#+ +#+       +#+ +#+
 #+#+# #+#+#  #+#        #+#       #+#    #+# #+#    #+# #+#       #+# #+#
  ###   ###   ########## ########## ########   ########  ###       ### ##########
  `;

  const waitingListAscii = `
::::::::::: :::    ::: ::::::::::      :::        ::::::::  :::   :::   :::     :::
    :+:     :+:    :+: :+:             :+:       :+:    :+: :+:   :+: :+: :+:   :+:
    +:+     +:+    +:+ +:+             +:+       +:+    +:+  +:+ +:+ +:+   +:+  +:+
    +#+     +#++:++#++ +#++:++#        +#+       +#+    +:+   +#++: +#++:++#++: +#+
    +#+     +#+    +#+ +#+             +#+       +#+    +#+    +#+  +#+     +#+ +#+
    #+#     #+#    #+# #+#             #+#       #+#    #+#    #+#  #+#     #+# #+#
    ###     ###    ### ##########      ########## ########     ###  ###     ### ##########
  `;

  const errorAscii = `
:::::::::: :::::::::  :::::::::   ::::::::  :::::::::
:+:        :+:    :+: :+:    :+: :+:    :+: :+:    :+:
+:+        +:+    +:+ +:+    +:+ +:+    +:+ +:+    +:+
+#++:++#   +#++:++#:  +#++:++#:  +#+    +:+ +#++:++#:
+#+        +#+    +#+ +#+    +#+ +#+    +#+ +#+    +#+
#+#        #+#    #+# #+#    #+# #+#    #+# #+#    #+#
########## ###    ### ###    ###  ########  ###    ###
  `;

  const successAscii = `
 ::::::::  :::    :::  ::::::::   ::::::::  :::::::::: ::::::::   ::::::::
:+:    :+: :+:    :+: :+:    :+: :+:    :+: :+:       :+:    :+: :+:    :+:
+:+        +:+    +:+ +:+        +:+        +:+       +:+        +:+
+#++:++#++ +#+    +:+ +#+        +#+        +#++:++#  +#++:++#++ +#++:++#++
       +#+ +#+    +#+ +#+        +#+        +#+              +#+        +#+
#+#    #+# #+#    #+# #+#    #+# #+#    #+# #+#       #+#    #+# #+#    #+#
 ########   ########   ########   ########  ########## ########   ########
  `;

  const welcomeBackAscii = `
  :::    ::: :::::::::: :::        :::        ::::::::
  :+:    :+: :+:        :+:        :+:       :+:    :+:
  +:+    +:+ +:+        +:+        +:+       +:+    +:+
  +#++:++#++ +#++:++#   +#+        +#+       +#+    +:+
  +#+    +#+ +#+        +#+        +#+       +#+    +#+
  #+#    #+# #+#        #+#        #+#       #+#    #+#
  ###    ### ########## ########## ########## ########
    :::      ::::::::      :::     ::::::::::: ::::    :::
  :+: :+:   :+:    :+:   :+: :+:       :+:     :+:+:   :+:
 +:+   +:+  +:+         +:+   +:+      +:+     :+:+:+  +:+
+#++:++#++: :#:        +#++:++#++:     +#+     +#+ +:+ +#+
+#+     +#+ +#+   +#+# +#+     +#+     +#+     +#+  +#+#+#
#+#     #+# #+#    #+# #+#     #+#     #+#     #+#   #+#+#
###     ###  ########  ###     ### ########### ###    ####
  `;

  const ascii = {
    ASCII_SWAG_SHOP: swagShopAscii,
    ASCII_WAITING_LIST: waitingListAscii,
    ASCII_ERROR: errorAscii,
    ASCII_SUCCESS: successAscii,
    ASCII_WELCOME: welcomeAscii,
    ASCII_WELCOME_BACK: welcomeBackAscii
  };

  let answer = "";
  let input;
  let lastLine;
  let terminalOutputContainer;
  let invertedTab = [true, false];

  export let wallet;
  export let terminal;
  let { paras, update, setHandlers, prompt } = terminal;
  let {
    address,
    balance,
    daiBalance,
    ethRequiredForDai,
    sortedWaitingList,
    emitter
  } = wallet;

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
      console.log({ address: get(address) });
      let gotWallet = a => {
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
          y: async () => {
            prompt.set("Loading...");
            console.log({ list: await wallet.isOnWaitingList() });
            if (await wallet.isOnWaitingList()) {
              purchaseFlow["WELCOME_BACK"]();
            } else {
              purchaseFlow["STEP_3"]();
            }
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
            terminal.handlers.y();
          }
        });
      };
      if (get(address)) {
        clearInterval(loadingInterval);
        return gotWallet(get(address));
      }
      address.subscribe(a => {
        if (!a) return;
        clearInterval(loadingInterval);
        gotWallet(a);
      });
      setHandlers({
        _DEFAULT: () => {
          update([`Wallet not detected, please wait...`]);
        }
      });
    },
    STEP_3: async () => {
      update([`--`]);
      if (get(daiBalance) >= MINIMUM_DAI_REQUIRED) {
        update(
          [
            `Great.`,
            `Since hoodies cost a reasonable sum of money, the minimum deposit is 200 DAI.`
          ],
          () => prompt.set(`How much DAI do you want to deposit? (200):`)
        );

        setHandlers({
          y: async () => {
            console.log(get(daiBalance));
            let daiAmount = answer;
            if (isNaN(Number(daiAmount))) {
              return update([
                `Please enter a number between 200 and ${Math.floor(
                  get(daiBalance).toFixed(1)
                )}`
              ]);
            }
            update([`Depositing ${daiAmount} DAI...`]);
            let loadingInterval = printLoading(500);

            try {
              // @todo we should really pause the output after the first tx
              // is confirmed by the user
              let depositTx = await wallet.approveDai(Number(daiAmount));
              update(
                [
                  `Approved DAI`,
                  `Tx: ${depositTx.hash}`,
                  `Let's use this time to grab your email address; we'll message you when your hoodie is done.`,
                  `Please enter your email.`
                ],
                prompt.set(`Email address: `)
              );
              setHandlers({
                _DEFAULT: () => {
                  if (wallet.emailSaved) return;
                  let email = answer;
                  if (/\S+@\S+\.\S+/.test(email)) {
                    update(
                      [
                        `Thanks, we'll email you at ${email} to confirm, and then again when your hoodie is ready.`
                      ],
                      prompt.set(`Waiting...`)
                    );
                    wallet.saveEmailAddress(email);
                  } else {
                    // not a valid email
                    update([`Invalid, email address.`, `Please re-enter it.`]);
                  }
                }
              });
              clearInterval(loadingInterval);
              await depositTx.wait();
              await emailCollected();
              const { hash, wait } = await wallet.depositDai(Number(daiAmount));
              clearInterval(loadingInterval);
              update([`Tx: ${hash}`]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["DEPOSIT_TX_SUCCEEDED"](tx);
              } else {
                purchaseFlow["DEPOSIT_TX_FAILED"]();
              }
            } catch (e) {
              console.error(e);
              clearInterval(loadingInterval);
              purchaseFlow["DEPOSIT_TX_FAILED"](
                "USER_DENIED_TRANSACTION_SIGNATURE"
              );
            }
          },
          n: () => {},
          _DEFAULT: () => {
            terminal.handlers.y();
          }
        });
      } else {
        const ethRequired = await ethRequiredForDai(200 - get(balance));
        const daiRequired = (200 - get(balance)).toFixed(2);
        console.log({ ethRequired });
        update(
          [
            `Unfortunately, you don't have 200 DAI right now.`,
            `It will cost ${Number(
              ethers.utils.formatEther(ethRequired)
            ).toFixed(
              2
            )} ETH to purchase the rest of the DAI you need (${daiRequired}).`
          ],
          () =>
            prompt.set(
              `How much DAI do you want to purchase? (${daiRequired}):`
            )
        );

        setHandlers({
          y: async (dai = null) => {
            if (dai) answer = dai;
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
              update([`Tx: ${hash}`]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["SWAP_TX_SUCCEEDED"](tx);
              } else {
                purchaseFlow["SWAP_TX_FAILED"]();
              }
            } catch (e) {
              console.error(e);
              clearInterval(loadingInterval);
              purchaseFlow["SWAP_TX_FAILED"](
                `USER_DENIED_TRANSACTION_SIGNATURE`
              );
            }
          },
          n: () => {
            update([`Okay.`], printStart);
          },
          _DEFAULT: () => {
            terminal.handlers.y(answer || daiRequired);
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
    SWAP_TX_FAILED: reason => {
      update(
        [
          `ASCII_ERROR`,
          reason,
          `Tx error, nuking the process...`,
          ``,
          ``,
          ``,
          ``,
          ``
        ],
        printStart
      );
    },
    DEPOSIT_TX_FAILED: reason => {
      update(
        [
          `ASCII_ERROR`,
          reason,
          "Transaction error, nuking the process...",
          ``,
          ``,
          ``,
          ``,
          ``
        ],
        printStart
      );
    },
    DEPOSIT_TX_SUCCEEDED: tx => {
      // sweet, now we tell the user their position in the waiting list i guess
      wallet.getWaitingList();
      update(
        [
          `ASCII_SUCCESS`,
          `You're officially "on the list" as they say.`,
          `Once there's enough collective interest to pay for your hoodie, we'll be in touch.`,
          `Keep it real, stay safe, be good.`
        ],
        () => {
          prompt.set(``);
          setTimeout(() => {
            autoClose();
          }, 5000);
        }
      );
      setHandlers({
        _DEFAULT: () => {
          printStart();
        }
      });
      // get the email address of the user who has deposited this DAI, and send
      // it to ourselves along with the ETH address they used to buy in
    },
    WELCOME_BACK: () => {
      let hint = `Type (i) to increase your DAI position, or (w) to withdraw`;
      update(
        [
          `ASCII_WELCOME_BACK`,
          `Welcome back, looks like you're already on the waiting list.`,
          `I must commend your taste.`,
          `You're currently ${wallet.myWaitingListPosition()} in the queue with a deposit of ${Number(
            wallet.getMyDaiDeposit()
          ).toFixed(2)} DAI`,
          hint
        ],
        () => prompt.set(`(i/w): `)
      );
      setHandlers({
        i: () => {
          update([`----`, `How much more DAI would you like to deposit?`], () =>
            prompt.set("Amount to deposit:")
          );
          setHandlers({
            _DEFAULT: async () => {
              let moreDai = Number(answer);
              console.log({ moreDai });
              update([`Depositing ${moreDai} more DAI`], () =>
                prompt.set("Waiting...")
              );
              let loadingInterval = printLoading();
              const approveTx = await wallet.approveDai(moreDai);
              update([`Tx: ${approveTx.hash}`]);
              clearInterval(loadingInterval);
              await approveTx.wait();
              const { hash, wait } = await wallet.depositMoreDai(moreDai);
              update([`Tx: ${hash}`]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["DEPOSIT_TX_SUCCEEDED"]();
              } else {
                purchaseFlow["DEPOSIT_TX_FAILED"]();
              }
            }
          });
        },
        w: () => {
          update([`----`, `How much DAI would you like to withdraw?`], () =>
            prompt.set("Amount to withdraw? (Max): ")
          );
          setHandlers({
            _DEFAULT: async () => {
              let withdrawAmount = Number(answer);
              if (!withdrawAmount) withdrawAmount = wallet.getMyDaiDeposit();
              console.log({ withdrawAmount });
              update([`Withdrawing ${withdrawAmount} DAI...`]);
              let loadingInterval = printLoading();
              prompt.set("Withdrawing...");
              const approveTx = await wallet.approveRDai(withdrawAmount);
              update([`Tx: ${approveTx.hash}`]);
              clearInterval(loadingInterval);
              await approveTx.wait();
              const { hash, wait } = await wallet.withdrawDai(withdrawAmount);
              update([`Tx: ${hash}`]);
              const tx = await wait();
              if (tx.status) {
                purchaseFlow["WITHDRAW_TX_SUCCEEDED"]();
              } else {
                purchaseFlow["WITHDRAW_TX_FAILED"]();
              }
            }
          });
        },
        _DEFAULT: () => update([hint])
      });
      // tell the user what position they are on the list and roughly how long they
      // might be waiting; we'll email them...
    },
    WITHDRAW_TX_SUCCEEDED: () => {
      wallet.getWaitingList();
      prompt.set("");
      update(
        [
          `ASCII_SUCCESS`,
          `Funds are safu.`,
          `If you change your mind, please come back.`
        ],
        () => setTimeout(() => autoClose(), 5000)
      );
    },
    WITHDRAW_TX_FAILED: reason => {
      prompt.set("");
      update(
        [
          `ASCII_ERROR`,
          reason,
          "Transaction error, nuking the process...",
          ``,
          ``,
          ``,
          ``,
          ``
        ],
        printStart
      );
    }
  };

  async function emailCollected() {
    return await new Promise(resolve => {
      let interval = setInterval(() => {
        console.log({ collected: wallet.emailSaved });
        if (wallet.emailSaved) {
          clearInterval(interval);
          return resolve(true);
        }
      }, 500);
    });
  }

  function autoClose() {
    prompt.set("");
    update([`This page will auto-close in`], () => {
      terminal.updateInterval.set(1000);
      update([`3`, `2`, `1`], () => {
        terminal.updateInterval.set(100);
        setTimeout(() => {
          update([`Just kidding, go about your business.`], () => {
            setHandlers({
              _DEFAULT: printStart
            });
          });
        }, 1500);
      });
    });
  }
  const commands = {
    y: () => {
      purchaseFlow["STEP_1"]();
    },
    w: () => {
      let i = get(sortedWaitingList).length;
      let waitingListEntries = get(sortedWaitingList)
        .reverse()
        .map(u => {
          return `${wallet.formatPosition(i--)} -- ${u.address}: ${Number(
            ethers.utils.formatEther(u.depositedAmount)
          ).toFixed(2)} DAI`;
        });
      console.log(waitingListEntries);
      let updateArr = [`ASCII_WAITING_LIST`]
        .concat(waitingListEntries)
        .concat([
          `----`,
          `Total DAI deposited: ${Number(
            ethers.utils.formatEther(get(wallet.totalDaiDeposited))
          ).toFixed(2)}`,
          `Type (y) to continue or (w) to see the current waiting list.`
        ]);
      update(updateArr);
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

  onMount(async () => {
    input.focus();
    setInterval(() => input.focus(), 100);
    printStart();
    const list = await wallet.getWaitingList();
    console.log({ list });
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
    } else if (terminal.handlers[terminal.DEFAULT_HANDLER_KEY] || !answer) {
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
  .terminal {
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

<div class="h-100 w-100 flex flex-column justify-between terminal">
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
        <div class="h-100 flex items-center justify-end pa3 f4">{$address}</div>
      </Container>
    </div>
  </div>
  <div class="h-100">
    <div class="h-100">
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
