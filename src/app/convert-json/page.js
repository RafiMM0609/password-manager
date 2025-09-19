'use client';
import { useState } from 'react';
import NavBar from '@/components/navbar';

export default function ConvertJsonPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputText(formatted);
    } catch (error) {
      setOutputText('Invalid JSON');
    }
  };

  return (
    <>
        <NavBar />
        <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-2xl text-center font-bold" style={{ color: 'var(--text-primary)' }}>Convert your Json</h1>
                </div>
            <div className="flex items-center justify-center p-6 space-x-8 w-full">
                <div id="json_input" className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full">
                    <div className="flex justify-between items-center">
                        <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg' onClick={() => {setInputText(''); setOutputText('');}}>
                            Reset
                        </button>
                        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Insert</h1>
                    </div>
                    <textarea
                    value={inputText}
                    onChange={handleInputChange}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your JSON here..."
                    style={{ background: 'var(--input-background)', color: 'var(--text-primary)' }}
                    ></textarea>
                </div>
                <div id="json_output" className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full">
                    <div className="flex justify-between items-center">
                        <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg' onClick={() => navigator.clipboard.writeText(outputText)}>
                            Copy
                        </button>
                        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Result</h1>
                    </div>
                    <textarea
                    disabled
                    value={outputText}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Formatted JSON will appear here..."
                    style={{ background: 'var(--input-background)', color: 'var(--text-primary)' }}
                    ></textarea>
                </div>
            </div>
        </div>
    </>
  );
}