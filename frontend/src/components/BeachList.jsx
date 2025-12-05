import { BeachCard } from './BeachCard'

export const BeachList = ({ beaches, onImageLoad, onToggleFavorite }) => {
console.log(beaches);
    return (
        <>
            {beaches.map((beach) => (
                <BeachCard key={beach.id} beach={beach} onImageLoad={onImageLoad} onToggleFavorite={onToggleFavorite}/>
            ))}
        </>
    )
}