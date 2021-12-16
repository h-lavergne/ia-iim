export default {
    methods: {
        async makeIaMove(board, playerNumber) {
            const bestColumn = this.getBestColumnForIa(board, playerNumber);
            const firstEmptyRow = this.getFirstEmptyRow(bestColumn, board);
            this.$set(board[firstEmptyRow], bestColumn, playerNumber);

            const status = await this.checkGameStatus();
            if (!status) {
                this.togglePlayer();
            }
            console.log(board)
            return board;
        },

        countUp(x, y, player, board) {
            let startY = y - this.connect >= 0 ? y - this.connect + 1 : 0;
            let counter = 0;
            for (; startY <= y; startY++) {
                if (board[startY][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
            }
            return counter;
        },

        countRight(x, y, player, board) {
            let endX =
                x + this.connect < this.columns
                    ? x + this.connect - 1
                    : this.columns - 1;
            let counter = 0;
            for (; x <= endX; x++) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
            }
            return counter;
        },
        countUpRight(x, y, player, board) {
            let endX =
                x + this.connect < this.columns
                    ? x + this.connect - 1
                    : this.columns - 1;
            let startY = y - this.connect >= 0 ? y - this.connect + 1 : 0;
            let counter = 0;
            while (x <= endX && startY <= y) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
                x++;
                y--;
            }
            return counter;
        },
        countDownRight(x, y, player, board) {
            let endX =
                x + this.connect < this.columns
                    ? x + this.connect - 1
                    : this.columns - 1;
            let endY =
                y + this.connect < this.rows ? y + this.connect - 1 : this.rows - 1;
            let counter = 0;
            while (x <= endX && y <= endY) {
                if (board[y][x] === player) {
                    counter++;
                } else {
                    counter = 0;
                }
                x++;
                y++;
            }
            return counter;
        },

        isWinner(player, board) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.columns; x++) {
                    let count = 0;
                    count = this.countUp(x, y, player, board);
                    if (count >= this.connect) return true;
                    count = this.countRight(x, y, player, board);
                    if (count >= this.connect) return true;
                    count = this.countUpRight(x, y, player, board);
                    if (count >= this.connect) return true;
                    count = this.countDownRight(x, y, player, board);
                    if (count >= this.connect) return true;
                }
            }
            return false;
        },

        isTie(board) {
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.columns; x++) {
                    const currentCell = board[y][x];
                    if (currentCell === this.emptySpace) {
                        return false;
                    }
                }
            }
            return true;
        },

        getBestColumnForIa(board, playerNumber) {
            const winnerColumn = this.getWinnerColumn(board, playerNumber);
            if (winnerColumn !== -1) {
                return winnerColumn;
            }
            const adversary = this.getAdversary(playerNumber);

            const winnerColumnForAdversary = this.getWinnerColumn(
                board,
                adversary
            );

            if (winnerColumnForAdversary !== -1) {
                return winnerColumnForAdversary;
            }
            const cpuStats = this.getColumnWithHighestScore(
                playerNumber,
                board
            );
            const adversaryStats = this.getColumnWithHighestScore(
                adversary,
                board
            );

            if (adversaryStats.highestCount > cpuStats.highestCount) {
                return adversaryStats.columnIndex;
            } else if (cpuStats.highestCount > 1) {
                return cpuStats.columnIndex;
            }
            const centralColumn = this.getCentralColumn(board);
            if (centralColumn !== -1) {
                return centralColumn;
            }

            return this.getRandomColumn(board);
        },
        getWinnerColumn(board, player) {
            for (let i = 0; i < this.columns; i++) {
                const boardClone = JSON.parse(JSON.stringify(board));
                // const boardClone = board;
                const firstEmptyRow = this.getFirstEmptyRow(i, boardClone);
                //Proceed only if row is ok
                if (firstEmptyRow !== -1) {
                    boardClone[firstEmptyRow][i] = player;

                    // If this is winner, return the column
                    if (this.isWinner(player, boardClone)) {
                        return i;
                    }
                }
            }
            return -1;
        },
        getColumnWithHighestScore(player, board) {
            const returnObject = {
                highestCount: -1,
                columnIndex: -1,
            };
            for (let i = 0; i < this.columns; i++) {
                const boardClone = JSON.parse(JSON.stringify(board));
                const firstEmptyRow = this.getFirstEmptyRow(i, boardClone);
                if (firstEmptyRow !== -1) {
                    boardClone[firstEmptyRow][i] = player;
                    const firstFilledRow = this.getFirstFilledRow(i, boardClone);
                }
            }
            return returnObject;
        },
        getRandomColumn(board) {
            while (true) {
                const boardClone = JSON.parse(JSON.stringify(board));
                const randomColumnIndex = this.getRandomNumberBetween(
                    0,
                    this.columns - 1
                );
                const firstEmptyRow = this.getFirstEmptyRow(
                    randomColumnIndex,
                    boardClone
                );
                if (firstEmptyRow !== -1) {
                    return randomColumnIndex;
                }
            }
        },
        getCentralColumn(board) {
            const boardClone = JSON.parse(JSON.stringify(board));
            const centralColumn = parseInt((this.columns - 1) / 2);
            if (this.getFirstEmptyRow(centralColumn, boardClone) !== -1) {
                return centralColumn;
            }
            return -1;
        },

        getFirstFilledRow(columnIndex, board) {
            for (let i = this.rows - 1; i >= 0; i--) {
                if (board[i][columnIndex] !== this.emptySpace) {
                    return i;
                }
            }
            return -1;
        },

        getFirstEmptyRow(columnIndex, board) {
            for (let i = this.rows - 1; i >= 0; i--) {
                if (board[i][columnIndex] === this.emptySpace) {
                    return i;
                }
            }
            return -1;
        },

        getAdversary(player) {
            if (player === this.ia1) {
                return this.player;
            } else {
                return this.ia1;
            }
        },

        async showWinner() {
            if (this.currentPlayer === this.player) {
                alert("Winner is player 1");
            } else {
                alert("IA won !");
            }
        },

        async showTie() {
            alert('TIE')
        }
    }
}