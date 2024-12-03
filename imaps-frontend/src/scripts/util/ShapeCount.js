const shapeCount = {
    infoPin: 0,
    wall: 0,
    entrance: 0,
    room: 0,
    stairs: 0
};

const updateShapeCount = (key) => {
    shapeCount[key]++;
}
const getShapeCount = (key) => {
    return shapeCount[key];
}

export {updateShapeCount, getShapeCount};

// todo za da sa incrementvit i posle restart na browwser, trebit vo baza nova tabela za broenje