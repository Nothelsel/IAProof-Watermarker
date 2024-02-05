import React from "react";
import { useTranslation } from "../../i18n";

const About = async ({ params: { lng } }: { params: { lng: string } }) => {
    const { t } = await useTranslation(lng, 'about')
    return (
        <div className="flex flex-row items-center justify-center px-20 z-[20] min-h-screen">
            <div className="flex flex-col justify-center text-center">
                <div className="justify-center flex">
                    {/* Vous pouvez ajouter des éléments ici si nécessaire */}
                </div>

                <div className="flex flex-col gap-6 mt-6 cursor-pointer hover:-translate-y-1 transition hover:scale-110 transition ease-in-out hover:text-transparent bg-clip-text hover:bg-gradient-to-r from-purple-500 to-orange-400 z-[1] tracking-tighter text-7xl font-semibold text-white max-w-[600px] w-auto h-auto">
                    {t('title')}
                </div>
                <p className="text-2xl font-medium tracking-tighter text-gray-300 max-w-[600px]">
                    {t('p1')} <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
                        {t('span')}
                    </span>  {t('p2')}
                </p>
                <p className="text-md text-gray-200 my-5 max-w-[600px]">
                    {t('p3')}
                </p>
            </div>
        </div>
    );
}


export default About;