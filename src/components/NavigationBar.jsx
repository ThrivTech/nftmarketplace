import React, { useState } from 'react'
import { Menu, X } from 'lucide-react' // You can also use Heroicons or any icon


const NavigationBar = ({ links }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-400">NFTStorm</h1>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} className="hover:text-purple-300">
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger menu icon */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} className="block hover:text-purple-300">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default NavigationBar
