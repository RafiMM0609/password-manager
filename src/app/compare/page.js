"use client";


import { useEffect, useState } from "react";
import NavBar from "@/components/navbar";


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

    function cleanText() {
        setText1("");
        setText2("");
        setIsSame(null);
    }

    return (
        <>
            <NavBar />
            <div className="w-full flex flex-col items-center *:mt-4"
            style={{ color: 'var(--text-white)' }}>
                <p className="text-4xl font-bold">Compare Page</p>
                <div className="flex flex-col items-center w-full">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg text-2xl font-semibold transition-colors" onClick={cleanText}>Clean Text</button>
                    {isSame !== null && (
                        <div className={`mt-4 px-8 py-4 rounded-xl shadow-lg text-2xl font-semibold transition-all ${isSame ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"}`}>
                            {isSame ? "Podo maseh" : "Bedho maseh"}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col items-center w-full">
                        <p className="text-xl p-2 rounded mb-2" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}>Text pertama</p>
                        <textarea
                            name="text1"
                            value={text1}
                            onChange={e => setText1(e.target.value)}
                            className="border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}
                        />
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <p className="text-xl p-2 rounded mb-2" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}>Text kedua</p>
                        <textarea
                            name="text2"
                            value={text2}
                            onChange={e => setText2(e.target.value)}
                            className="border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );

}