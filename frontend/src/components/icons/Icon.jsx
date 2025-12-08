export const Icon = ({ src, width, height, alt, filter }) => {
    return (
        <img src={`/icons/${src}`} className={`${width} ${height}`} style={{ filter: filter ?? "none" }} alt={ alt } loading="lazy"/>
    )
}