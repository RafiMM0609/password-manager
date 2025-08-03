import { requestToBodyStream } from "next/dist/server/body-streams";


export default function Simpanan(){
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
            <h1 className="text-gray-800 text-4xl">Simpanan
            </h1>
            <h1 className="text-gray-800 text-2xl mb-8">
                Halaman ini hanya untuk yang sudah login
            </h1>
            <p className="text-gray-800 text-lg mb-4">
                Jika Anda melihat halaman ini, berarti Anda telah berhasil login.
            </p>
            <p className="text-gray-800 text-lg mb-4">
                Selamat datang di halaman simpanan.
            </p>
        </div>
    );
}