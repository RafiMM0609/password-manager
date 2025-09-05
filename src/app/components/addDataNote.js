import React, { useState, useEffect } from 'react';
import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";

export function AddDataNote({ onClose, onSuccess, existingData }) {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (existingData) {
            setKey(existingData[0].data_key || "");
            setValue(existingData[0].data_value || "");
            setNote(existingData[0].data_note || "");
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-500 to-red-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {existingData ? 'Edit Password' : 'Tambah Password Baru'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                            aria-label="Tutup"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Website/Service Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website / Nama Layanan
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                type="text"
                                required={true}
                                name="key"
                                placeholder="Contoh: Gmail, Facebook, Instagram"
                                value={key}
                                onChange={e => setKey(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 pr-12"
                                    type={showPassword ? "text" : "password"}
                                    required={true}
                                    name="value"
                                    placeholder="Masukan password"
                                    value={value}
                                    onChange={e => setValue(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.75 6.105 6.75 9.75 6.75 1.563 0 3.063-.375 4.438-1.027M21.75 12c-.375-.75-.938-1.5-1.563-2.152m-2.25-2.25A10.477 10.477 0 0 0 12 5.25c-1.563 0-3.063.375-4.438 1.027M9.75 9.75a3 3 0 1 1 4.5 4.5m-4.5-4.5L4.5 4.5m15 15-4.5-4.5" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan (opsional)
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none"
                                name="note"
                                rows="4"
                                placeholder="Tambahkan catatan seperti username, email, atau informasi tambahan lainnya"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-red-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </div>
                                ) : (
                                    existingData ? 'Update' : 'Simpan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}