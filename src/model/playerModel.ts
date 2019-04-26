export class Player {
    socketId: string
    name: string;
    id: number;

    constructor(name: string, id: number, socketId: string){
        this.name = name;
        this.id = id;
        this.socketId = socketId;
    }
}