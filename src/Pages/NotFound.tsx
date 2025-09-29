import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="h-screen place-content-center bg-gray-950 px-4">
            <div className="text-center">
                <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-200 sm:text-4xl">Uh-oh!</h1>

                <p className="mt-4 text-gray-400 mb-4">No pudimos encontrar esa página.</p>
                <button
                    className="font-sans flex justify-center gap-2 items-center mx-auto shadow-xl text-lg text-white bg-gray-800 backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-cyan-600 hover:text-white before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 border-cyan-600 rounded-full group"
                    type="submit"
                    onClick={() => navigate('/')}
                >
                    Volver al inicio
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 19"
                        className="w-8 h-8 justify-end bg-gray-600 group-hover:rotate-90 group-hover:bg-cyan-500 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                    >
                        <path
                            className="fill-gray-200 group-hover:fill-gray-900"
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export { NotFound };