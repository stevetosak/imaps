export default function useRoomTypes(formData,setFormData,roomTypes,setRoomTypes,map){
    const addRoomType = () => {
        if (!formData.type || roomTypes.includes(formData.type)) return;
        setRoomTypes((prevTypes) => [...prevTypes, formData.type]);
        setFormData({ ...formData, type: "" });
        map.addRoomType(formData.type);
        console.log("TYPES" + map.roomTypes);
    };

    const removeRoomType = (typeToRemove) => {
        setRoomTypes((prevTypes) => prevTypes.filter((type) => type !== typeToRemove));
        map.removeRoomType(typeToRemove);
    };

    return {addRoomType,removeRoomType}
}