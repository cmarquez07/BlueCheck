import { Map } from './Map'
import { BeachList } from './BeachList'
import '../styles/Home.css'

export const Home = () => {
    return (
        <div className='flex flex-col lg:flex-row'>
            <div id='map-container' className='w-full lg:w-2/3'>
                <Map />
            </div>
            <div id='beach-list' className='overflow-x-scroll lg:overflow-x-hidden w-full lg:w-1/3 flex flex-row lg:flex-col'>
                <BeachList />
            </div>
        </div>
    )
}