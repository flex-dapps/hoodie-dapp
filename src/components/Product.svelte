<script>
  import { onMount } from "svelte";
  let canvas = document.getElementsByTagName("canvas")[0];

  let frame;
  onMount(() => {
    let ctx = canvas.getContext("2d");
    setTimeout(() => {
      canvas.height = canvas.clientHeight;
      canvas.width = canvas.clientWidth;
      console.log({ canvas });
      frame = requestAnimationFrame(loop);
    }, 500);

    console.log(canvas.clientHeight);
    console.log({ canvas });

    function loop() {
      console.log("hello");
      // if (canvas) {
      //   canvas.height = canvas.clientHeight;
      //   canvas.width = canvas.clientWidth;
      // }
      ctx.fillStyle = "red";
      ctx.fillRect(50, 50, 50, 50);
      frame = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<style>
  img {
    width: 100%;
    height: auto;
  }
  canvas {
    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
</style>

<div class="w-100 h-100 flex items-center">
  <!-- <img src="/img/front.png" /> -->
  <canvas bind:this={canvas} />
</div>
