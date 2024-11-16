export default class ConnectionGraph {
    constructor() {
        this.nodeNameMap = new Map();
        this.edges = new Map();
    }

    addNode(node) {
        console.log(node.info)
        this.nodeNameMap.set(node.info.name,node);
    }

    addEdge(node1Name, node2Name) {

        for (const key of this.nodeNameMap.keys()) {
            console.log(key);
        }

        const node1 = this.nodeNameMap.get(node1Name);
        const node2 = this.nodeNameMap.get(node2Name)

        if (!this.edges.has(node1)) {
            this.edges.set(node1, []);
        }
        if (!this.edges.has(node2)) {
            this.edges.set(node2, []);
        }

        this.edges.get(node1).push(node2);
        this.edges.get(node2).push(node1);

        console.log("edges " + node1.info.name + " :", this.edges.get(node1));
        console.log("edges " + node2.info.name + " :", this.edges.get(node2));


        node1.connect(node2);

        console.log("edges:", this.edges);
    }

    updateEntry(oldName,shape){
        console.log("OLD NAME IN UPDATE ENTRY: " + oldName )
        console.log("NEW NAME IN UPDATE ENTRY: " + shape.info.name )

        let removed = this.nodeNameMap.delete(oldName);
        this.nodeNameMap.set(shape.info.name,shape);



        console.log("REMOVED: " + removed,this.nodeNameMap,"MAP")
    }

    removeConnection(node1Name, node2Name) {
        let node1 = this.nodeNameMap.get(node1Name);
        let node2 = this.nodeNameMap.get(node2Name);

        let node1ConnectionsUpdated = this.edges.get(node1).filter(node => node !== node2);
        let node2ConnectionsUpdated = this.edges.get(node2).filter(node => node !== node1);

        node1.removeConnectionLine(node2);

        this.edges.set(node1,node1ConnectionsUpdated);
        this.edges.set(node2,node2ConnectionsUpdated);

        console.log("edges node1 delete:", this.edges.get(node1).length);
        console.log("edges node2 delete:", this.edges.get(node2).length);

    }


}