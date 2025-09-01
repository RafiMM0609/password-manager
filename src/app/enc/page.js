"use client";

import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";
import { useState } from "react";


export default function Myenc() {
    const [data, setData] = useState("");
    const [encryptedData, setEncryptedData] = useState("");
    const [decryptedData, setDecryptedData] = useState("");
    const password = "strongpassword123"; 
    
    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            {/* Header */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Tes Enkripsi</h1>
                    <p className="text-gray-600">Uji coba fitur enkripsi dan dekripsi</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Encryption Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Enkripsi</h2>
                            <p className="text-gray-600 text-sm">Masukkan teks untuk dienkripsi</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teks Original
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                    type="text"
                                    placeholder="Masukkan teks yang akan dienkripsi"
                                    value={data}
                                    onChange={e => setData(e.target.value)}
                                />
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                                onClick={async () => {
                                    if (!data.trim()) {
                                        alert('Mohon masukkan teks terlebih dahulu');
                                        return;
                                    }
                                    const encrypted = await aesGcmEncrypt(data, password);
                                    setEncryptedData(encrypted);
                                }}
                            >
                                🔒 Enkripsi
                            </button>

                            {encryptedData && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hasil Enkripsi
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm font-mono"
                                        rows="4"
                                        readOnly
                                        value={encryptedData}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Decryption Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Dekripsi</h2>
                            <p className="text-gray-600 text-sm">Masukkan teks terenkripsi untuk didekripsi</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teks Terenkripsi
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono text-sm"
                                    rows="4"
                                    placeholder="Masukkan teks terenkripsi"
                                    value={encryptedData}
                                    onChange={e => setEncryptedData(e.target.value)}
                                />
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                onClick={async () => {
                                    if (!encryptedData.trim()) {
                                        alert('Mohon masukkan teks terenkripsi terlebih dahulu');
                                        return;
                                    }
                                    try {
                                        const decrypted = await aesGcmDecrypt(encryptedData, password);
                                        setDecryptedData(decrypted);
                                    } catch (error) {
                                        alert('Gagal mendekripsi: ' + error.message);
                                    }
                                }}
                            >
                                🔓 Dekripsi
                            </button>

                            {decryptedData && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hasil Dekripsi
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg"
                                        readOnly
                                        value={decryptedData}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Login
                    </button>
                </div>
            </div>
        </div>
    );
}