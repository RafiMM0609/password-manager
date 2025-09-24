"use client";


import { useEffect, useState, useRef } from "react";
import NavBar from "@/components/navbar";


export default function ComparePage() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const debounceTimeout1 = useRef();
    const debounceTimeout2 = useRef();
    const [pendingText1, setPendingText1] = useState("");
    const [pendingText2, setPendingText2] = useState("");

    function cleanText() {
        setText1("");
        setText2("");
        setPendingText1("");
        setPendingText2("");
    }

    function highlightDiff(textA, textB) {
        const linesA = textA.split('\n');
        const linesB = textB.split('\n');
        const maxLines = Math.max(linesA.length, linesB.length);
        const resultA = [];
        const resultB = [];
        for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
            const lineA = linesA[lineIdx] || "";
            const lineB = linesB[lineIdx] || "";
            const maxLen = Math.max(lineA.length, lineB.length);
            console.log(lineA, lineB);
            if (textA.length > 0 || textB.length > 0) {
                resultA.push(<span id={`a-${lineIdx}`} style={{ display: "inline-block" }} className="bg-gray-200 rounded-lg text-center w-6 g-gray-200 text-black mr-1">{lineIdx + 1}</span>);
                resultB.push(<span id={`b-${lineIdx}`} style={{ display: "inline-block" }} className="bg-gray-200 rounded-lg text-center w-6 g-gray-200 text-black mr-1">{lineIdx + 1}</span>);
            }
            for (let i = 0; i < maxLen; i++) {
                const charA = lineA[i] || "";
                const charB = lineB[i] || "";
                const isDiff = charA !== charB;
                // query componen span a-${lineIdx} jika isDiff true, tambahkan class bg-yellow-200 text-black
                if (isDiff) {
                    const elA = document.getElementById(`a-${lineIdx}`);
                    const elB = document.getElementById(`b-${lineIdx}`);
                    if (elA) {
                        elA.classList.add("bg-yellow-200", "text-black");
                    }
                    if (elB) {
                        elB.classList.add("bg-yellow-200", "text-black");
                    }
                }
                else {
                    const elA = document.getElementById(`a-${lineIdx}`);
                    const elB = document.getElementById(`b-${lineIdx}`);
                    if (elA) {
                        elA.classList.remove("bg-yellow-200");
                    }
                    if (elB) {
                        elB.classList.remove("bg-yellow-200")
                    }
                }

                resultA.push(
                    <span key={`a-${lineIdx}-${i}`} style={isDiff ? { background: "#FFFF14", color: "#000" } : {}} className="z-1">
                        {charA}
                    </span>
                );
                resultB.push(
                    <span key={`b-${lineIdx}-${i}`} style={isDiff ? { background: "#1F758F", color: "#000" } : {}}>
                        {charB}
                    </span>
                );
            }
            // Add line break after each line except the last
            if (lineIdx < maxLines - 1) {
                resultA.push(<br key={`a-br-${lineIdx}`} />);
                resultB.push(<br key={`b-br-${lineIdx}`} />);
            }
        }
        return { resultA, resultB };
    }

    // Debounce effect for text1
    useEffect(() => {
        if (debounceTimeout1.current) clearTimeout(debounceTimeout1.current);
        debounceTimeout1.current = setTimeout(() => {
            setText1(pendingText1);
        }, 300); // 300ms debounce
        return () => clearTimeout(debounceTimeout1.current);
    }, [pendingText1]);

    // Debounce effect for text2
    useEffect(() => {
        if (debounceTimeout2.current) clearTimeout(debounceTimeout2.current);
        debounceTimeout2.current = setTimeout(() => {
            setText2(pendingText2);
        }, 300);
        return () => clearTimeout(debounceTimeout2.current);
    }, [pendingText2]);

    const { resultA, resultB } = highlightDiff(text1, text2);

    return (
        <>
            <NavBar />
            <div className="w-full flex flex-col items-center *:mt-4"
            style={{ color: 'var(--text-white)' }}>
                <p className="text-4xl font-bold">Compare Page</p>
                <div className="flex flex-col items-center w-full">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg text-2xl font-semibold transition-colors" onClick={cleanText}>Clean Text</button>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col items-center min-w-3/6 space-y-4">
                        <p className="text-xl p-2 rounded mb-2" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}>Text pertama</p>
                        <div className="bg-gray-500 border rounded w-[calc(100%-2rem)] overflow-auto">{resultA}</div>
                        <textarea
                            name="text1"
                            value={pendingText1}
                            onChange={e => setPendingText1(e.target.value)}
                            className="border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}
                        />
                    </div>
                    <div className="flex flex-col items-center min-w-3/6 space-y-4">
                        <p className="text-xl p-2 rounded mb-2" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}>Text kedua</p>
                        <div className="bg-gray-500 border rounded w-[calc(100%-2rem)] overflow-auto">{resultB}</div>
                        <textarea
                            name="text2"
                            value={pendingText2}
                            onChange={e => setPendingText2(e.target.value)}
                            className="border rounded px-4 py-2 w-[calc(100%-2rem)] h-80 resize-none"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-white)' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}