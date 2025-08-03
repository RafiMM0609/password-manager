"use client";

import { useState } from "react";

const data = ['asdsad','asdasd','adsdsad'];

export function ListItem() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-400 text-gray-900 space-y-2 p-2 rounded-4xl">
            {data.map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded-xl shadow">
                    <p>{item}</p>
                </div>
            ))}
        </div>
    );
}

export function AddData({ onClose }) {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        const trimmedNote = note.trim();
        fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: trimmedKey, value: trimmedValue, note: trimmedNote }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    alert('Data berhasil ditambahkan');
                    onClose();
                } else {
                    alert('Gagal menambahkan data: ' + (data?.error || 'Unknown error'));
                }
            })
            .catch((err) => {
                alert('Terjadi error: ' + err.message);
            });
    }

    return (
        <div className="backdrop-blur-sm fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
            <div className="bg-gray-100 p-4 rounded-lg shadow-lg relative w-[400px]">
                <button
                    onClick={onClose}
                    className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center absolute top-0 right-0 text-white hover:bg-red-600 text-2xl shadow focus:outline-none"
                    aria-label="Tutup"
                >
                    &times;
                </button>
                <form className="flex flex-col items-center justify-center space-y-2 bg-gray-800 p-4 rounded-md shadow-md">
                    <input
                        className="text-center border-2 border-gray-100 rounded-md w-full h-12"
                        type="text"
                        required={true}
                        name="key"
                        placeholder="Masukan key"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                    />
                    <input
                        className="text-center border-2 border-gray-100 rounded-md w-full h-12"
                        type="text"
                        required={true}
                        name="value"
                        placeholder="Masukan nilai"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <input
                        className="text-center border-2 border-gray-100 rounded-md w-full h-16"
                        type="text"
                        name="note"
                        placeholder="Masukan catatan"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <button onClick={handleSubmit} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">Tambah</button>
                </form>
            </div>
        </div>
    );
}

export default function Simpanan() {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="flex items-center h-screen bg-gray-300">
            <ListItem />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-300 p-8">
                <button onClick={() => setShowModal(true)} className="bg-green-600 px-4 rounded-3xl text-4xl">
                    +
                </button>
                <h1 className="text-gray-800 text-4xl">Simpanan</h1>
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
            {showModal && <AddData onClose={() => setShowModal(false)} />}
        </div>
    );
}