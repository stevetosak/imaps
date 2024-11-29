import { BoxesLoader } from "react-awesome-loaders";
export const BoxesLoaderComponent = () => {
    return (
        <>
            <BoxesLoader
                boxColor={"#6366F1"}
                style={{ marginLeft: "300px" }}
                desktopSize={"128px"}
                mobileSize={"80px"}
            />
        </>
    );
};