export const DataUsage = () => {
    return (
        <div className="w-90 lg:w-full max-w-xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-xl mb-10">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Uso de datos</h1>
                <p className="text-sm text-gray-500">Información sobre orígenes de datos y licencias usadas en la aplicación.</p>
            </header>

            <div>
                <p className="text-gray-500">
                    Esta aplicación utiliza información oficial proporcionada por la <strong>Agencia Catalana del Agua (ACA)</strong> de la Generalitat de Catalunya. Los datos consultados se emplean exclusivamente con fines informativos para ofrecer al usuario detalles actualizados sobre el estado y las características de las playas de Cataluña.
                </p>
                <br />
                <p className="text-gray-500">La información pública utilizada puede incluir, entre otros aspectos:</p>
                <ul className="text-gray-500 list-disc pl-10 mt-3">
                    <li>Condiciones del agua</li>
                    <li>Calidad ambiental</li>
                    <li>Servicios disponibles</li>
                    <li>Alertas o avisos oficiales</li>
                </ul>
                <br />

                <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Uso de iconos</h2>
                <p className="text-gray-500">En esta aplicación también se han utilizado algunos iconos procedentes de <strong>Flaticon</strong>. Estos iconos se emplean únicamente con fines visuales para mejorar la experiencia del usuario y la claridad de la información mostrada. Estos iconos son propiedad de sus respectivos autores y están sujetos a las condiciones de uso de Flaticon.</p>
                <br/>

                <p className="text-gray-500">
                    Si deseas más información sobre las fuentes de datos o los derechos de uso, puedes visitar:
                </p>
                <ul>
                    <li><a href="https://aca.gencat.cat" target="_blank" rel="noopener noreferrer" className="text-[#007FD5] underline">Agencia Catalana del Agua – Generalitat de Catalunya</a></li>
                    <li><a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer" className="text-[#007FD5] underline">Flaticon – Condiciones de uso</a></li>
                </ul>
            </div>


            <footer className="mt-8 text-sm text-gray-500">
                <p>Última actualización: <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time></p>
            </footer>
        </div>
    )
}