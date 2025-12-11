export const Loader = () => {

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] h-[100dvh]" data-testid="loader">
            <div className="p-6 rounded-xl shadow-2xl text-center">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto"></div>
            </div>
        </div>
    )
}