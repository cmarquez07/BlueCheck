import { Map } from "./Map"
import { BeachList } from "./BeachList"
import "../styles/Home.css"

export const Home = () => {
    return (
        <div className="main-container flex flex-col lg:flex-row justify-between">
            <div id="map-container" className="w-full lg:w-2/3">
                <Map />
            </div>
            <div id="beach-list" className="overflow-x-scroll lg:overflow-x-hidden w-full lg:w-1/3 flex flex-row lg:flex-col gap-[20px] pl-[20px] pb-[20px]">
                <BeachList />
            </div>
        </div>
    )
}