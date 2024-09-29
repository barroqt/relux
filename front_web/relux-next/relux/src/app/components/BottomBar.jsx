import React from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaWallet, FaCog } from 'react-icons/fa';

const BottomAppBar = () => {
  const router = useRouter();

  const buttons = [
    { route: '/home', icon: <FaSearch size={20} className="thin-icon" />, label: 'Home' },
    { route: '/wallet', icon: <FaWallet size={20} className="thin-icon" />, label: 'Wallet' },
    { route: '/settings', icon: <FaCog size={20} className="thin-icon" />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-4">
      <div className="flex justify-around">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => router.push(button.route)}
            className="flex flex-col items-center"
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomAppBar;