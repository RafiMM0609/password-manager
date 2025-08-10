import React, { useState, useEffect } from 'react';
import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";

export function AddDataNote({ onClose, onSuccess, existingData }) {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const existdatahandler = () => {
        if (existingData) {
            setKey(existingData[0].data_key || "");
            setValue(existingData[0].data_value || "");
            setNote(existingData[0].data_note || "");
        }
    }

    useEffect(() => {
        if (existingData) {
            existdatahandler();
        }
    }, [existingData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            const trimmedNote = note.trim();

            setLoading(true);
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: existingData ? existingData[0].id : null,
                    key: await aesGcmEncrypt(trimmedKey), 
                    value: await aesGcmEncrypt(trimmedValue), 
                    note: await aesGcmEncrypt(trimmedNote) 
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert('Gagal menambahkan data: ' + (data?.error || 'Unknown error'));
            } else {
                alert('Data berhasil ditambahkan');
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (err) {
            alert('Gagal menambahkan data: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="backdrop-blur-sm fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
            
            <div className="bg-gray-100 p-4 rounded-lg shadow-lg relative w-[500px]">
                <button
                    onClick={onClose}
                    className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute top-0 right-0 text-white hover:bg-red-600 text-2xl shadow focus:outline-none"
                    aria-label="Tutup"
                >
                    &times;
                </button>
                <form className="flex flex-col items-center justify-center space-y-2 bg-gray-800 p-4 rounded-md shadow-md">
                    <input
                        className="text-left border-2 pl-4 border-gray-100 rounded-md w-full h-12"
                        type="text"
                        required={true}
                        name="key"
                        placeholder="Masukan key"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                    />
                    <div className="relative w-full">
                        <input
                            className="text-left border-2 pl-4 border-gray-100 rounded-md w-full h-12 pr-10"
                            type={showPassword ? "text" : "password"}
                            required={true}
                            name="value"
                            placeholder="Masukan nilai"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.75 6.105 6.75 9.75 6.75 1.563 0 3.063-.375 4.438-1.027M21.75 12c-.375-.75-.938-1.5-1.563-2.152m-2.25-2.25A10.477 10.477 0 0 0 12 5.25c-1.563 0-3.063.375-4.438 1.027M9.75 9.75a3 3 0 1 1 4.5 4.5m-4.5-4.5L4.5 4.5m15 15-4.5-4.5" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <textarea
                        className="text-left border-2 pl-4 border-gray-100 rounded-md w-full h-60"
                        name="note"
                        placeholder="Masukan catatan"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">Tambah</button>
                </form>
            </div>
        </div>
    );
}