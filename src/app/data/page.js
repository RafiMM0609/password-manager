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
            {showModal && <AddDataNote 
            onClose={() => (setShowModal(false) , setExistingData(false))} 
            onSuccess={fetchData} 
            existingData={existingData}
            />}
        </div>
    );
}