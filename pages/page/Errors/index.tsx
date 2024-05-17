
import { useRouter } from "next/router";

function Error()
{
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black bg-opacity-10">
            <div className="bg-white w-[55vw] rounded-sm flex justify-center item-center flex-col shadow-md">
                <p className="text-[80px] font-bold text-center text-orange-600 m-5">Oops !</p>
                <p className="text-xl text-center m-5 font-bold uppercase text-gray-700">404 - Page not found</p>
                <p className="text-center m-5 text-lg font-semibold text-gray-700">The page you are looking for might have been removed, <br/> had its name changed, or you might not have access to it.</p>
                <button className="text-white mt-5 p-2 text-xl"
                onClick={()=>{router.back()}}
                style=
                {{
                    background:"linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
                }}>
                        Go Back
                </button>
            </div>
        </div>
    )
}

export default Error;