"use client";


import { useEffect, useState } from "react";


export default function ComparePage() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [isSame, setIsSame] = useState(null);

    useEffect(() => {
        if (text1 === "" && text2 === "") {
            setIsSame(null);
        } else {
            setIsSame(text1 === text2);
        }
    }, [text1, text2]);

    return (
        <div className="w-full flex flex-col items-center *:mt-10">
            <p className="text-4xl font-bold">Compare Page</p>
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center w-full">
                    <p className="text-xl bg-gray-500 p-2 rounded text-gray-100">Text pertama</p>
                    <textarea
                        name="text1"
                        value={text1}
                        onChange={e => setText1(e.target.value)}
                        className="bg-gray-800 text-gray-100 border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                    />
                </div>
                <div className="flex flex-col items-center w-full">
                    <p className="text-xl bg-gray-500 p-2 rounded text-gray-100">Text kedua</p>
                    <textarea
                        name="text2"
                        value={text2}
                        onChange={e => setText2(e.target.value)}
                        className="bg-gray-800 text-gray-100 border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                    />
                </div>
            </div>
            {isSame !== null && (
                <div className={`mt-8 px-8 py-4 rounded-xl shadow-lg text-2xl font-semibold ${isSame ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {isSame ? "Podo maseh" : "Bedho maseh"}
                </div>
            )}
        </div>
    );
}