<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">
            <button @click="makeMove(col)" class="btn btn-warning">
              Make move here&nbsp;<i class="fa fa-arrow-down"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in board" :key="index">
          <td v-for="(cell, i) in row" :key="i">
            <img class="img-fluid img-player" :src="cellImage(cell)" alt="" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import mixin from "@/mixins.js";
import emptyImg from "@/assets/empty.png";
import player1Img from "@/assets/player1.png";
import player2Img from "@/assets/player2.png";

export default {
  name: "ConnectFour",
  mixins: [mixin],
  data() {
    return {
      board: [],
      columns: 7,
      rows: 6,
      connect: 4,
      emptySpace: 0, // Valeur des cases de tableau vides
      ia1: 1, // Valeur du joueur n°1
      player: 2, // Valeur du joueur n°2
      currentPlayer: 1,
    };
  },
  async mounted() {
    this.resetGame();
    this.selectPlayer();
    this.togglePlayer();
  },
  methods: {
    // Méthode qui fait bouger notre IA
    async makeHomeIaMove() {
      setTimeout(async () => {
        this.board = await this.makeIaMove(this.board, this.currentPlayer);
      }, 800);
    },

    async makeMove(columnNumber) {
      const columnIndex = columnNumber - 1;
      const firstEmptyRow = this.getFirstEmptyRow(columnIndex, this.board);
      if (firstEmptyRow === -1) {
        Swal.fire("Cannot put here, it is full");
        return;
      }
      this.$set(this.board[firstEmptyRow], columnIndex, this.currentPlayer);
      const status = await this.checkGameStatus();
      if (!status) {
        this.togglePlayer();
        setTimeout(() => {
          this.makeIaMove(this.board, this.currentPlayer);
        }, 500);
      }
    },
    //////////////////////////////////////////////////////////

    resetGame() {
      this.initBoard();
      this.selectPlayer();
    },

    cellImage(cell) {
      if (cell === this.ia1) {
        return player1Img;
      } else if (cell === this.player) {
        return player2Img;
      } else {
        return emptyImg;
      }
    },

    selectPlayer() {
      if (this.getRandomNumberBetween(0, 1) === 0) {
        this.currentPlayer = this.ia1;
      } else {
        this.currentPlayer = this.player;
      }
    },

    initBoard() {
      this.board = [];
      for (let i = 0; i < this.rows; i++) {
        this.board.push([]);
        for (let j = 0; j < this.columns; j++) {
          this.board[i].push(this.emptySpace);
        }
      }
    },

    togglePlayer() {
      this.currentPlayer = this.getAdversary(this.currentPlayer);
      // this.makeHomeIaMove();
    },

    getRandomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    async checkGameStatus() {
      if (this.isWinner(this.currentPlayer, this.board)) {
        await this.showWinner();
        return true;
      } else if (this.isTie(this.board)) {
        await this.showTie();
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
body {
  height: 100vh;
}
td {
  background-color: #149b3c;
  border: 0px !important;
  padding: 5px !important;
}
.img-player {
  max-width: 100px;
}
</style>
