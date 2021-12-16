<template>
  <div id="all">
    <h1>Dijkstra</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from "three";
export default {
  name: "Dijkstra",
  data() {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");
      let tailleTab = 16;
      this.camera = new Three.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        20
      );
      this.camera.position.z = 15;
      this.camera.position.x = tailleTab / 2;
      this.camera.position.y = tailleTab / 2;

      this.scene = new Three.Scene();
      let tab = [];
      let tiles = [];

      const geometry = new Three.PlaneGeometry(1, 1);
      const terre = new Three.MeshBasicMaterial({
        color: 0x32cd32,
        side: Three.DoubleSide,
      });
      const lave = new Three.MeshBasicMaterial({
        color: 0xed0000,
        side: Three.DoubleSide,
      });

      // generation map
      for (let i = 0; i < tailleTab; i++) {
        tab[i] = [];
        tiles[i] = [];
        for (let j = 0; j < tailleTab; j++) {
          let mat = terre;
          tab[i][j] = "terre";
          if (Math.floor(Math.random() * 3) == 0) {
            mat = lave;
            tab[i][j] = "lave";
          }
          tiles[i][j] = new Three.Mesh(geometry, mat);
          this.scene.add(tiles[i][j]);
          //console.log(i + "  " +j)
          tiles[i][j].position.x = i;
          tiles[i][j].position.y = j;
        }
      }

      // generation key
      let xkey = Math.floor(Math.random() * tailleTab);
      let ykey = Math.floor(Math.random() * tailleTab);
      tab[xkey][ykey] = "key";
      tiles[xkey][ykey].material = new Three.MeshBasicMaterial({
        color: 0xffff00,
        side: Three.DoubleSide,
      });

      // generation hero
      let x = xkey;
      let y = ykey;
      while (x == xkey && y == ykey) {
        x = Math.floor(Math.random() * tailleTab);
        y = Math.floor(Math.random() * tailleTab);
      }
      tab[x][y] = "hero";
      tiles[x][y].material = new Three.MeshBasicMaterial({
        color: 0xf4fefe,
        side: Three.DoubleSide,
      });

      // Tiles connectés
      var dir = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];

      // Queue
      var q = [];

      let iteration = 0;

      // Début en partant du héro
      q.push([x, y]);

      while (q.length > 0) {
        var p = q[0];
        q.shift();

        iteration++;
        console.log("iteration " + iteration);

        // Finito
        if (tab[p[0]][p[1]] == "key") break;

        // Passé

        if (tab[p[0]][p[1]] !== "hero" && tab[p[0]][p[1]] !== undefined) {
          tab[p[0]][p[1]] = "visited";
          tiles[p[0]][p[1]].material = new Three.MeshBasicMaterial({
            color: 0xbbbbbb,
            side: Three.DoubleSide,
          });
        }

        // Check les cotés
        for (var i = 0; i < 4; i++) {
          var a = p[0] + dir[i][0];
          var b = p[1] + dir[i][1];

          // Si tile != lave && check pr undefined
          if (
            a >= 0 &&
            b >= 0 &&
            a < tab.length &&
            b < tab[0].length &&
            tab[a][b] !== "lave" &&
            tab[a][b] !== "visited"
          ) {
            q.push([a, b]);
          }
        }
      }

      // let pointer = { x, y };

      // let iterationNumber = 100;

      // do {
      //   borders.forEach((border) => {
      //     let curTile = tab[pointer.x + border.x][pointer.y + border.y];
      //     if (
      //       curTile !== "lave" &&
      //       curTile !== "hero" &&
      //       curTile !== undefined
      //     ) {
      //       pointer = { x: pointer.x + border.x, y: pointer.y + border.y };
      //       tiles[pointer.x][pointer.y].material = new Three.MeshBasicMaterial({
      //         color: 0xbbbbbb,
      //         side: Three.DoubleSide,
      //       });
      //     }
      //   });
      //   iterationNumber--;
      // } while (iterationNumber > 0);

      //------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      //this.mesh.rotation.x += 0.01;
      //this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style scoped>
#container {
  width: 1000px;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
}
</style>