export const BeachReport = ({ report }) => {

    const flagBadge = (color) => {
        const map = {
            Verde: "bg-green-500",
            Amarilla: "bg-yellow-400",
            Roja: "bg-red-500",
            default: "bg-gray-400"
        };

        return map[color] || map.default;
    }

    console.log(report);
    return (
        <article key={report.id} className="max-w-md w-full bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-100 ">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 text-kaushan">Reporte de {report.username}</h3>
                    {report.beach_name && (
                        <h4 className="text-md font-semibold text-slate-800">{report.beach_name}</h4>
                    )}
                    <p className="text-sm text-slate-500 mt-1">Observaciones del usuario sobre el estado de la playa a fecha de: {new Date(report.created_at).toLocaleString("es-ES", {
                        dateStyle: "short",
                        timeStyle: "short"
                    })}</p>
                </div>

                <div className="ml-4 flex items-center">
                    <span
                        className={`inline-block w-10 h-6 rounded-md ${flagBadge(report.flag_color)} shadow-sm`}
                        title={`Bandera: ${report.flag_color}`}
                        aria-label={`Bandera: ${report.flag_color}`}
                    />
                </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-y-3 text-sm text-slate-700">
                <div className="flex justify-between">
                    <dt className="font-medium">Estado del agua</dt>
                    <dd className="text-right">{report.water_status}</dd>
                </div>

                <div className="flex justify-between">
                    <dt className="font-medium">Limpieza del agua</dt>
                    <dd className="text-right">{report.water_cleanliness}</dd>
                </div>

                <div className="flex justify-between">
                    <dt className="font-medium">Limpieza de la playa</dt>
                    <dd className="text-right">{report.beach_cleanliness}</dd>
                </div>

                <div className="flex justify-between">
                    <dt className="font-medium">Afluencia</dt>
                    <dd className="text-right">{report.people_number}</dd>
                </div>

                <div className="flex justify-between">
                    <dt className="font-medium">Medusas</dt>
                    <dd className="text-right">{report.jellyfish_presence}</dd>
                </div>

                {report.comment && (
                    <div className="col-span-1 mt-2">
                        <dt className="font-medium">Comentario</dt>
                        <dd className="mt-1 text-sm text-slate-600 bg-gray-50 p-3 rounded-md">{report.comment}</dd>
                    </div>
                )}
            </dl>
        </article>
    )
}