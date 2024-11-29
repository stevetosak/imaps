class ShapeRegistry{
    constructor() {
        if(!ShapeRegistry.instance){
            this.store = {
                shapes: []
            };
            ShapeRegistry.instance = this;
        }

        return ShapeRegistry.instance;
    }

    set(key, value) {
        this.store[key] = value;
    }

    get(key) {
        return this.store[key];
    }

    updateShapes(shape){
        this.store.shapes.push(shape)
    }

    delete(key) {
        delete this.store[key];
    }
}

const instance = new ShapeRegistry();
Object.freeze(instance);

export default instance;