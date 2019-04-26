import * as io from 'socket.io';
import * as ioCli from 'socket.io-client';
import * as chai from 'chai';

import { socketio } from '../../src';
import api from '../../src';

const assert = chai.assert;
const expect = chai.expect;
const url = 'http://0.0.0.0:5000';
const options: SocketIOClient.ConnectOpts = {
    transports: ['websocket'],
    forceNew: true
};

describe('Socket.io ', () => {
    describe('server ', () => {
        let server: io.Server;
        let client: SocketIOClient.Socket
        let client2: SocketIOClient.Socket

        beforeEach(() => {
            server = socketio.listen(5000);
            client = ioCli.connect(url, options);
            client2 = ioCli.connect(url, options);
        });

        afterEach(() => {
            server.close();
            client.close();
            client2.close();
        });

        describe('connection', () => {
            it('should connect to a socket on the server', (done: Function) => {
                client.on("connect", () => {
                    assert.equal(client.connected, true);
                    client.disconnect();
                    done();
                });
            });
        });

        describe('message', () => {
            it('should send a message and receive a message', (done: Function) => {
                let client3: SocketIOClient.Socket = ioCli.connect(url, options);
                client.on('message', (data: any) => {
                    //data = JSON.parse(data);
                    switch (data.type) {
                        case 'message':
                            expect(data.message).to.equal('server: testing');
                            break;
                        case 'new-game':
                            expect(data.board).to.equal(typeof (Array));
                            break;
                        case 'update-board':
                            expect(data.board).to.equal(typeof (Array));
                            break;
                        case 'game-full':
                            expect(data.message).to.equal('All games are currently full');
                            break;
                        case 'game-over':
                            expect(data.result).to.equal(typeof (Boolean));
                            break;
                        case 'activePlayers':
                            expect(data.result).to.equal(typeof(Array));
                            break;
                    }
                    client.disconnect();
                    done();
                });
                client.on('connect', () => {
                    let message = { operation: 'message', message: 'testing' };
                    client.emit(message.operation, JSON.stringify(message));
                });
            });
        }); // End describe message

        describe('new-game', () => {
            it('should return an object that is of type array and has only 0\'s', (done: Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                    client.on('message', (data:any)=>{
                        expect(data.playerNumber).to.equal(1);
                    })
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                    client2.on('message', (data: any) => {
                        assert(data.type, 'new-game');
                        expect(data.board).to.equal(typeof (Array));
                        expect(data.playerNumber).to.equal(2);
                        data.board.forEach((element: Array<number>) => {
                            expect(element.every(x => x === 0)).to.equal(true);
                        });
                    });
                });
                client.disconnect();
                client2.disconnect();
                done();
            });
        }); // end describe game ops

        describe('update-board', () => {
            it('should return an updated array which contains 1 or more elements that do not equal 0', (done: Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                    message.operation = 'make-move';
                    message.move = 2;
                    client.emit(message.operation, JSON.stringify(message));
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                    message.operation = 'make-move';
                    message.move = 3;
                    client2.emit(message.operation, JSON.stringify(message));
                    client2.on('message', (data: any) => {
                        assert(data.type, 'update-board');
                        expect(data.board).to.equal(typeof (Array));
                        data.board.forEach((element: Array<number>) => {
                            expect(element.every(x => x === 0)).not.equal(true);
                        });
                    });
                });
                client.disconnect();
                client2.disconnect();
                done();
            });
        });

        describe('game-full', () => {
            it('should return a message which tells larry the game is full', (done: Function) => {
                var client3 = ioCli.connect(url, options);
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                });
                client3.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'larrythelatecomer',
                        move: 0
                    };
                    client3.emit(message.operation, JSON.stringify(message));
                    client3.on('message', (data: any) => {
                        expect(data.type).to.equal('game-full');
                        assert(data.message, 'All games are currently full');
                    });
                });
                client.disconnect();
                client2.disconnect();
                client3.disconnect();
                client3.close();
                done();
            });
        });

        describe('game-over', () => {
            it('should return an boolean value, false to represent the game is not over', (done: Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                    message.operation = 'check-win';
                    client.emit(message.operation, JSON.stringify(message));
                    client.on('message', (data: any) => {
                        expect(data.result).to.equal(false);
                    });
                });

                client.disconnect();
                done();
            });

            it('should return an boolean value, true because a player has disconnected(forfeit)', (done: Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                    client.disconnect();
                    client2.on('message', (data: any) => {
                        assert(data.type, 'game-over');
                        expect(data.result).to.equal(true);
                    });

                });

                client2.disconnect();
                done();
            });

            it('should return an boolean value, true because a player has connected 5', (done: Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));

                    client2.on('connect', () => {
                        var message = {
                            operation: 'new-game',
                            message: 'oscartheopponent',
                            move: 0
                        };
                        client2.emit(message.operation, JSON.stringify(message));
                    });
                    message.operation = 'make-move';
                    message.move = 1;

                    message.operation = 'make-move';
                    message.move = 4;

                    for (var i = 0; i < 5; i++) {
                        message.operation = 'make-move';
                        message.move = 7;
                        client.emit(message.operation, JSON.stringify(message));
                        message.operation = 'make-move';
                        message.move = i;
                        client.emit(message.operation, JSON.stringify(message));

                        message.operation = 'check-win';
                        client.emit(message.operation, JSON.stringify(message));
                        client.on('message', (data: any) => {
                            expect(data.result).to.equal(i === 4 ? true : false);
                        });
                    }

                });

                client.disconnect();
                done();
            });
        });
        describe('whos-turn', () => {
            it('should respond with either 1 or 2', (done:Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                    message.operation = 'make-move';
                    message.move = 2;
                    client.emit(message.operation, JSON.stringify(message));
                    client.emit('whos-turn');
                    client.on('message', (data: any) => {
                        assert(data.type, 'whos-turn');
                        expect(data.message).to.equal(2);
                    });
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                    message.operation = 'make-move';
                    message.move = 3;
                    client2.emit(message.operation, JSON.stringify(message));
                    client.emit('whos-turn');
                    client.on('message', (data: any) => {
                        assert(data.type, 'whos-turn');
                        expect(data.message).to.equal(1);
                    });
                });
                client.disconnect();
                client2.disconnect();
                done();
            });
            
        });
        describe('players', () => {
            it('should respond with a list of player names on starting a new game where the first name is tommythetester and the 2nd is oscartheopponent', (done:Function) => {
                client.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'tommythetester',
                        move: 0
                    };
                    client.emit(message.operation, JSON.stringify(message));
                    client.on('message', (data:any)=>{
                        expect(data.playerNumber).to.equal(1);
                        data.names.forEach((element:any) =>{
                            assert(element, 'tommythetester');
                        });
                    });
                });
                client2.on('connect', () => {
                    var message = {
                        operation: 'new-game',
                        message: 'oscartheopponent',
                        move: 0
                    };
                    client2.emit(message.operation, JSON.stringify(message));
                    client2.on('message', (data: any) => {
                        expect(data.playerNumber).to.equal(2);
                        assert(data.type, 'activePlayers');
                        data.names.forEach((element:any, i:any) => {
                            if(i == 0){
                                assert(element, 'tommythetester');
                            }else{
                                assert(element, 'oscartheopponent');
                            }
                        });
                    });
                });

                client.disconnect();
                client2.disconnect();
                done();
            });
        });
    });
    after(() => {     
        api.close()
    });
});