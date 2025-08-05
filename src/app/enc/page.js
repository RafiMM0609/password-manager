"use client";

import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";
import { useState } from "react";


export default function Myenc() {
    const [data, setData] = useState("");
    const password = "strongpassword123"; 
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-400 text-gray-900 space-y-2 p-2 rounded-4xl">
            <h1>Tes Encryption</h1>
            <input
                className="text-center border-2 border-gray-100 rounded-md w-[calc(40%)]"
                type="text"
                value={data}
                onChange={e => setData(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                    const encrypted = await aesGcmEncrypt(data, password);
                    alert(encrypted);
                }}
            >
                Encrypt
            </button>
            <h1>
                Tes Decryption
            </h1>
            <input
                className="text-center border-2 border-gray-100 rounded-md w-[calc(40%)]"
                type="text"
                value={data}
                onChange={e =>  setData(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                    const decrypted = await aesGcmDecrypt(data, password);
                    alert(decrypted);
                }}
            >
                Decrypt
            </button>
        </div>
    );
}