
//todo birsenje mozda refaktor skros

export default class ConnectionGraph{
    constructor() {
        this.nodes = [];
        this.edges = new Map();
    }

    addNode(node){
        this.nodes.push(node);
    }

    addConnection(node1,node2){
        let first = false;
        let second = false;


        if(!this.edges.has(node1)){
            this.edges.set(node1,node2);
            first = true;
        }
        if(!this.edges.has(node2)){
            this.edges.set(node2,node1);
            second = true;
        }

        if(first){
            node1.connectTo(node2); // todo ova vo shapeot impl
        } else if(second) {
            node2.connectTo(node1);
        }
    }


}