import React from 'react';
import { Source_Serif_4 } from 'next/font/google';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-white text-black">
            <div className={`app-name text-4xl font-bold ${sourceSerif.className}`}>Relux</div>
            <button className="login-button text-sm bg-black text-white font-medium py-2 px-4 rounded-3xl">
                wallet connect
            </button>
        </header>
    );
};

export default Header;