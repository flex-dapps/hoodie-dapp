import ethers from 'ethers'

const store = {
  provider: null,
  init: web3 => {
    // does this connect to the provider?
    // store.provider = new ethers.providers.Web3Provider(web3.currentProvider)
    // console.log({ provider: store.provider })
    // return store
  },
  connect: () => {}
}

export default store
