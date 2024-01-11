import React from "react";


const About = () => {
    return (
        <div className="flex flex-row items-center justify-center px-20 z-[20] min-h-screen">
            <div className="flex flex-col justify-center text-center">
                <div className="justify-center flex">
                    {/* Vous pouvez ajouter des éléments ici si nécessaire */}
                </div>

                <div className="flex flex-col gap-6 mt-6 cursor-pointer hover:-translate-y-1 transition hover:scale-110 transition ease-in-out hover:text-transparent bg-clip-text hover:bg-gradient-to-r from-purple-500 to-orange-400 z-[1] tracking-tighter text-7xl font-semibold text-white max-w-[600px] w-auto h-auto">
                    À propos de Filigrane Generator
                </div>
                <p className="text-2xl font-medium tracking-tighter text-gray-300 max-w-[600px]">
                    Filigrane Generator est un outil qui vous permet de <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
                    générer des filigranes personnalisés
                    </span> pour vos images.
                </p>
                <p className="text-md text-gray-200 my-5 max-w-[600px]">
                    Il utilise des technologies web modernes pour traiter vos images directement dans votre navigateur. Aucune donnée n'est envoyée à un serveur ou conservée. Tout est traité localement sur votre machine pour garantir la confidentialité de vos données.
                </p>
            </div>
        </div>
    );
}


export default About;