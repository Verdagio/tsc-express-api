import * as config from 'config';
import * as SocketIO from 'socket.io';

import app from './app/app';
import { Board } from './model/boardModel';
import { Player } from './model/playerModel';


const env = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'default';
const server = {
    port: config.get(`Server.${env}.port`),
    name: config.get(`Server.${env}.name`)
}

const api = app.listen(server.port, () => {
    console.log(`http ${server.name} is listening on ${server.port}`);
});

export const socketio = SocketIO(api);

var board: Board;
var players: Player[] = new Array();
var activeConnections = 0;
let currentPlayer = 1;
let lastPlayer = '';
socketio.on('connection', socket => {

    console.log('%s connected', socket.id);

    socket.on('new-game', data => {
        board = new Board();
        data = JSON.parse(data);
        players.push(new Player(data.message, activeConnections + 1, socket.id));

        if (activeConnections < 2) {
            activeConnections++;
            socket.emit('message', { type: 'new-game', board: board.board, playerNumber: players.length});
            socket.emit('message', { type: 'activePlayers', names:  players.map(player => player.name)});
            socket.broadcast.emit('message', { type: 'activePlayers', names:  players.map(player => player.name)});
            
        } else {
            socket.emit('message', { type: 'game-full', message: 'All games are currently full' });
        }
    });

    socket.on('make-move', data => {

        data = JSON.parse(data);
        players.forEach((player, i) => {
            if (player.socketId !== socket.id) {
                currentPlayer = player.id;
            } else {
                lastPlayer = player.name;
            }
        });
        board.insert(data.move, data.player);
        socket.emit('message', { type: 'update-board', board: board.board });
        socket.emit('message', { type: 'whos-turn', message: currentPlayer });
        socket.broadcast.emit('message', { type: 'update-board', board: board.board });
        socket.broadcast.emit('message', { type: 'whos-turn', message: currentPlayer });
    });

    socket.on('check-win', () => {
        socket.emit('message', { type: 'game-over', result: board.checkAdjacent(), name: lastPlayer });
    });

    socket.on('message', data => {
        data = JSON.parse(data);
        socket.emit('message', { type: 'message', message: 'server: ' + data.message });
    });
    socket.on('whos-turn', () => {
        socket.broadcast.emit('message', { type: 'whos-turn', message: currentPlayer });
    });

    socket.on('reset', () => {
        board.reset();
        currentPlayer = 1;
        lastPlayer = '';
        socket.emit('message', {
            type: 'reset', message: {
                board: board.board,
                currentPlayer: currentPlayer
            }
        });
        socket.broadcast.emit('message', {
            type: 'reset', message: {
                board: board.board,
                currentPlayer: currentPlayer
            }
        });
    });

    socket.on('disconnect', () => {
        players.forEach((player, index) => {
            if (player.socketId == socket.id) {
                players.splice(index, 1);
                activeConnections--;
            }
        });
        socket.broadcast.emit('message', { type: 'game-over', result: true, name: lastPlayer });
        console.log('%s disconnected\n %s active players', socket.id, activeConnections);
    });

});

export default api;