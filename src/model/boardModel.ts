const STARTING_STATE: number[][] = [
    [0, 0, 0, 0 ,0, 0, 0, 0, 0],
    [0, 0, 0, 0 ,0, 0, 0, 0, 0],
    [0, 0, 0, 0 ,0, 0, 0, 0, 0],
    [0, 0, 0, 0 ,0, 0, 0, 0, 0],
    [0, 0, 0, 0 ,0, 0, 0, 0, 0],
    [0, 0, 0, 0 ,0, 0, 0, 0, 0]
];
const players: number[] = [1,2];
export class Board {
    board: number[][];


    constructor() {
        this.board = STARTING_STATE;
    }

    public insert(x: number, player: number) {
        let index = -1;

        for(var i = 0; i < this.board.length; i++){
            if(this.board[i][x] === 0){
                index = i;
            }
        }  
        if(index >= 0){
            this.board[index][x] = player;
        }
    }

    public checkAdjacent() {
        var leftDiag: number[] = new Array();
        var rightDiag: number[] = new Array();
        var horizontal: number[] = new Array();
        var vertical: number[] = new Array();

        for (var i = 0; i < this.board.length - 4; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                if (j >= 4) {
                    leftDiag.push(this.board[i][j], this.board[i + 1][j - 1], this.board[i + 2][j - 2], this.board[i + 3][j - 3], this.board[i + 4][j - 4]);
                    if (this.isCombination(leftDiag)) return true;
                }
                if (j < 5) {
                    rightDiag.push(this.board[i][j], this.board[i + 1][j + 1], this.board[i + 2][j + 2], this.board[i + 3][j + 3], this.board[i + 4][j + 4]);
                    if (this.isCombination(rightDiag)) return true;

                    horizontal.push(this.board[i][j], this.board[i][j + 1], this.board[i][j + 2], this.board[i][j + 3], this.board[i][j + 4]);
                    if (this.isCombination(horizontal)) return true;
                }
                vertical.push(this.board[i][j], this.board[i + 1][j], this.board[i + 2][j], this.board[i + 3][j], this.board[i + 4][j]);
                if (this.isCombination(vertical)) return true;

                leftDiag.splice(0, 5);
                rightDiag.splice(0, 5);
                horizontal.splice(0, 5);
                vertical.splice(0, 5);
            }
        }
        return false;
    }

    private isCombination(arr: number[]) {
        if (arr.every((el) => el === 1) || arr.every((el) => el === 2)) {
            return true;
        }
        return false;
    }

    public reset(){
        this.board = STARTING_STATE;
    }
}

// var board = new Board();

// console.log(board.checkAdjacent());
// board.insert(2, 0, 1);
// board.insert(1, 1, 1);
// board.insert(2, 2, 1);
// board.insert(3, 3, 1);
// board.insert(4, 4, 1);
// board.insert(2, 0, 2);
// console.log(board.checkAdjacent());


// console.log(board.board)