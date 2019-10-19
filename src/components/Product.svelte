<script>
  import { onMount } from "svelte";
  let canvas = document.getElementsByTagName("canvas")[0];
  import { triangle, meter, barcode, slidingSquare } from "./shapes";

  let frame;
  let t = 0;
  let width, height;
  let mouse = {};

  onMount(() => {
    let ctx = canvas.getContext("2d");
    setTimeout(() => {
      canvas.height = canvas.clientHeight;
      canvas.width = canvas.clientWidth;
      width = canvas.width;
      height = canvas.height;
      frame = requestAnimationFrame(loop);
    }, 500);

    //  (function() {
    //   document.onmousemove = handleMouseMove;
    //   function handleMouseMove(event) {
    //     var eventDoc, doc, body;
    //     event = event || window.event;
    //     mouse.x = event.pageX;
    //     mouse.y = event.pageY  ;
    //   }
    // })();

    function loop() {
      let xu = width / 10;
      let yu = height / 10;
      t += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#A7E4AE";
      ctx.strokeStyle = "#A7E4AE";
      ctx.font = "15px monospace";
      ctx.lineWidth = 2;

      meter(ctx, 4 * xu, 1 * yu, 5 * xu, 4, t);
      barcode(ctx, 40, height - 200, 200, 140, 20);
      ctx.save();
      ctx.rotate((-45 * Math.PI) / 180);
      ctx.translate(-450, 0);
      slidingSquare(ctx, 0, 0, 150, 20, t, width / 1.5);
      ctx.restore();

      frame = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<style>
  .product {
    position: relative;
  }
  img {
    width: 100%;
    height: auto;
    z-index: 2;
    position: relative;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
</style>

<div class="product w-100 h-100 flex items-center">
  <img src="/img/front-5.png" />
  <canvas bind:this={canvas} />
</div>
