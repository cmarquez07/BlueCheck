import { BeachCard } from './BeachCard'

export const BeachList = ({ beaches, onImageLoad, onToggleFavorite }) => {
    return (
        <>
            {beaches.map((beach) => (
                <BeachCard key={beach.id} beach={beach} onImageLoad={onImageLoad} onToggleFavorite={onToggleFavorite}/>
            ))}
        </>
    )
}