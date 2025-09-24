export default function NavBar(){
    const navButtons = [
        {
            label: 'Compare',
            href: '/compare'
        },
        {
            label: 'Convert JSON',
            href: '/convert-json'
        },
        {
            label: 'Keluar',
            onClick: () => {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/';
            }
        }
    ];

    const handleMouseEnter = (e) => {
        e.target.style.color = 'var(--text-primary)';
    };

    const handleMouseLeave = (e) => {
        e.target.style.color = 'var(--text-secondary)';
    };

    return (
        <div className="border-b sticky top-0 z-10" style={{ background: 'var(--modal-bg)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center animate-dimlight">
                        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Rafi Mahrus</h1>
                    </div>
                    <div className="flex items-center space-x-4 font-medium text-white">
                        {navButtons.map((btn, idx) => (
                            <button
                                key={btn.label}
                                onClick={btn.onClick ? btn.onClick : () => window.location.href = btn.href}
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className={`
                                    hover:underline rounded-md px-2 py-1 transition-all duration-10 ${'hover:border-2 hover:border-white hover:bg-blue-100'}
                                `}
                           >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}