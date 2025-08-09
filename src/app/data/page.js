"use client";

import { useEffect, useState } from "react";
import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";
import { renderToStaticMarkup } from "react-dom/server";




export function ListItem({ data, loading, error, deleteItem, onSelect }) {
    const [decryptedData, setDecryptedData] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setDecryptedData([]);
            return;
        }
        let isMounted = true;
        Promise.all(
            data.map(async (item) => {
                try {
                    if (item.data_key) {
                        item.data_key = await aesGcmDecrypt(item.data_key) || '-';
                    }
                    if (item.id) {
                        item.id = await aesGcmDecrypt(item.id) || '-';;
                    }
                } catch (e) {
                    alert('Gagal mendekripsi data: ' + e.message);
                }
                return { ...item};
            })
        ).then((result) => {
            if (isMounted) setDecryptedData(result);
        });
        return () => { isMounted = false; };
    }, [data]);

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

    return (
        <div className="flex flex-col items-left justify-center h-screen bg-gray-400 text-gray-900 
        space-y-2 p-2 rounded-4xl max-w-40">
            {decryptedData.length === 0 ? (
                <div className="p-2 bg-white rounded-xl shadow">Tidak ada data</div>
            ) : (
                decryptedData.map((item, idx) => (
                    <div key={item.id} className="p-2 bg-white rounded-xl shadow">
                        <p onClick={() => onSelect(item.id)}
                            className="truncate"
                            title={item.data_key}>{item.data_key}</p>
                        <p onClick={(e) => deleteItem(e, item.id)} className="text-red-500 cursor-pointer">Delete</p>
                    </div>
                ))
            )}
        </div>
    );
}

export function AddData({ onClose, onSuccess, existingData }) {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
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
            const res = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
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
        }
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
                    <input
                        className="text-left border-2 pl-4 border-gray-100 rounded-md w-full h-16"
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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingData, setExistingData] = useState(false);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch('/api/get-list')
            .then(async (res) => {
                if (!res.ok) throw new Error('Gagal mengambil data');
                const result = await res.json();
                setData(result.data || []);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (e, id) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const trimmedId = id.trim();
        fetch('api/data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''
            },
            body: JSON.stringify({ id: trimmedId }),
        })
        .then (async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Gagal menghapus data');
            alert('Data berhasil dihapus');
            fetchData();
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => setLoading(false));
    }

    const handleSelect = (id) => {
        setLoading(true);
        setError(null);

        const trimmedId = id.trim();
        fetch(`api/data?id=${encodeURIComponent(trimmedId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''
            },
        })
        .then(async (res) => {
            if (!res.ok) throw new Error('Gagal mengambil data');
            const result = await res.json();
            console.log('Selected data:', result);
            Promise.all(result.map(async (item) => {
                try {
                    if (item.data_key) {
                        item.data_key = await aesGcmDecrypt(item.data_key) || '-';
                    }
                    if (item.data_value) {
                        item.data_value = await aesGcmDecrypt(item.data_value) || '-';
                    }
                    if (item.data_note) {
                        item.data_note = await aesGcmDecrypt(item.data_note) || '-';
                    }
                } catch (e) {
                    alert('Gagal mendekripsi data: ' + e.message);
                }
                return { ...item };
            }))
            .then((decryptedData) => {
                setExistingData(decryptedData);
                setShowModal(true);
            });
        })
        .catch((err) => {
            setError(err.message);
        })
        .finally(() => setLoading(false));
    }

    return (
        <div className="flex items-center h-screen bg-gray-300">
            <ListItem data={data} loading={loading} error={error} deleteItem={handleDelete} onSelect={handleSelect} />
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
            {showModal && <AddData onClose={() => setShowModal(false)} onSuccess={fetchData} existingData={existingData}/>}
        </div>
    );
}