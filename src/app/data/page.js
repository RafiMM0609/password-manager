"use client";

import { useEffect, useState } from "react";
import { aesGcmDecrypt, aesGcmEncrypt } from "@/lib/helpers";
// import { AddData } from "@/app/components/addData";
import { AddDataNote } from "@/app/components/addDataNote";
import { ListItem } from "@/app/components/listItem";


export default function Simpanan() {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingData, setExistingData] = useState(false);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch('/api/get-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''}`
            }
        })
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-red-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-800">Password Manager</h1>
                        </div>
                        <button 
                            onClick={() => {
                                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                window.location.href = '/';
                            }}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar */}
                <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Daftar Password</h2>
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="w-full bg-gradient-to-r from-gray-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Baru
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ListItem data={data} loading={loading} error={error} deleteItem={handleDelete} onSelect={handleSelect} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Selamat Datang!</h2>
                        <p className="text-gray-600 text-lg mb-4">
                            Kelola password Anda dengan aman dan mudah
                        </p>
                        <p className="text-gray-500 mb-6">
                            Pilih password dari daftar di sebelah kiri untuk melihat detailnya, atau tambah password baru.
                        </p>
                        <div className="flex flex-col space-y-3 text-sm text-gray-500">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Enkripsi end-to-end
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Akses yang aman
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mudah digunakan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <AddDataNote 
            onClose={() => (setShowModal(false) , setExistingData(false))} 
            onSuccess={fetchData} 
            existingData={existingData}
            />}
        </div>
    );
}