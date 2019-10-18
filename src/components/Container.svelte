<script>
  export let inverted;
  export let top;
  export let bottom;
  export let left;
  export let right;
</script>

<style>
  div {
    border-width: 0.25rem;
    border-color: #a7e4ae;
    background: #2a333e;
  }

  .inverted {
    background: #a7e4ae;
    border-color: #2a333e;
  }

  .top {
    border: none;
    border-top: 0.2rem solid #a7e4ae;
  }
  .bottom {
    border: none;
    border-bottom: 0.2rem solid #a7e4ae;
  }
  .left {
    border: none;
    border-left: 0.2rem solid #a7e4ae;
  }
  .right {
    border: none;
    border-right: 0.2rem solid #a7e4ae;
  }
</style>

<div
  class="w-100 h-100 ba"
  class:inverted
  class:top
  class:bottom
  class:left
  class:right>
  <slot />
</div>
