export default function NavBar(){
    return(
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center animate-dimlight">
                        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Rafi Mahrus</h1>
                    </div>
                    <div className="flex items-center space-x-4 font-medium">
                        <button 
                            onClick={() => window.location.href = '/compare'}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Compare
                        </button>
                        <button 
                            onClick={() => window.location.href = '/convert-json'}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Convert JSON
                        </button>
                        <button 
                            onClick={() => {
                                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                window.location.href = '/';
                            }}
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}