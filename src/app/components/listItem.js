import React, { useState, useEffect } from 'react';
import { aesGcmDecrypt } from "@/lib/helpers";

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
        <div className="flex flex-col items-left justify-center 
        h-screen bg-gray-400 text-gray-900 
        space-y-2 p-2 rounded-4xl max-w-60
        overflow-y-auto">
            {decryptedData.length === 0 ? (
                <div className="p-2 bg-white rounded-xl shadow">Tidak ada data</div>
            ) : (
                decryptedData.map((item, idx) => (
                    <div key={item.id} className="p-2 bg-white rounded-xl shadow">
                        <p onClick={() => onSelect(item.id)}
                            className="truncate"
                            title={item.data_key}>{item.data_key}</p>
                        <button onClick={(e) => deleteItem(e, item.id)} className="text-red-500 cursor-pointer" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}