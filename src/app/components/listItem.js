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

    if (loading) return (
        <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
                <svg className="animate-spin h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-accent)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p style={{ color: 'var(--text-primary)' }}>Memuat...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: 'var(--text-accent)' }}>{error}</p>
            </div>
        </div>
    );

    function handleClientSearch(e){
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = data.filter(item => item.data_key.toLowerCase().includes(searchTerm));
        setDecryptedData(filteredData);
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            <input type="search" placeholder="Cari..." 
                className="w-full mb-2 p-2 border border-gray-300 rounded" 
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} 
                onChange={(e) => handleClientSearch(e)} 
            />
            {decryptedData.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Belum ada password tersimpan</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Klik &quot;Tambah Baru&quot; untuk mulai</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {decryptedData.map((item, idx) => (
                        <div key={item.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <button 
                                        onClick={() => onSelect(item.id)}
                                        className="flex-1 text-left"
                                        title={`Klik untuk melihat detail ${item.data_key}`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-red-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4" style={{ color: 'var(--text-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2v6m0 0V9a2 2 0 00-2-2m0 0V5a2 2 0 00-2-2v4zm-6 0V3a2 2 0 00-2 2v4m0 0a2 2 0 00-2 2v6m0 0v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium truncate" style={{ color: 'var(--text-primary)', maxWidth: '200px' }}>
                                                    {item.data_key}
                                                </p>
                                                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Klik untuk melihat detail</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={(e) => deleteItem(e, item.id)} 
                                        className="transition-colors duration-200 p-1 rounded animate-pulse" 
                                        style={{ color: 'var(--text-secondary)' }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--text-accent)'}
                                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                                        title="Hapus password"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}