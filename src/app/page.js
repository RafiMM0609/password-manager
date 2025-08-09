"use client";
import Image from "next/image";
import { supabase } from '@/lib/supabaseClient';


import { useState } from "react";

export default function Home() {
  const [nama, setNama] = useState("");
  const [sandi, setSandi] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNama = nama.trim();
    const trimmedSandi = sandi.trim();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nama: trimmedNama, sandi: trimmedSandi }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          alert('Login berhasil');
          document.cookie = `token=${data.token}; path=/; max-age=86400;`;
          window.location.href = '/data';
        } else {
          alert('Login gagal: ' + (data?.error || 'Unknown error'));
        }
      })
      .catch((err) => {
        alert('Terjadi error: ' + err.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <h1 className="text-gray-800 text-4xl">Selamat datang sir</h1>
      <h1 className="text-gray-800 text-2xl mb-8">halaman ini tidak rahasia</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center space-y-4 bg-gray-800 
        p-2 rounded-md shadow-md 
        w-[calc(50%)] h-[calc(50%)]"
      >
        <p className="text-white text-lg mb-8 bg-gray-600 p-4 rounded-md shadow-2xl">Masukan nama dan sandi</p>
        <input
          className="text-center border-2 border-gray-100 rounded-md w-[calc(40%)]"
          type="text"
          name="nama"
          placeholder="Masukan nama"
          value={nama}
          onChange={e => setNama(e.target.value)}
        />
        <input
          className="text-center border-2 border-gray-100 rounded-md w-[calc(40%)]"
          type="password"
          name="sandi"
          placeholder="Masukan sandi"
          required={true}
          value={sandi}
          onChange={e => setSandi(e.target.value)}
        />
        <button className="bg-green-800 
        text-white py-1 rounded-md
        w-[calc(50%)]" type="submit">Submit</button>
      </form>
    </div>
  );
}
