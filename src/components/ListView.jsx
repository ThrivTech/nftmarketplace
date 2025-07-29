import React from 'react'

const ListView = ({ items }) => {
  return (
    <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-800">
      {items.map((item, idx) => (
        <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition">
          <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-sm text-gray-400">By {item.owner}</p>
          <p className="text-purple-300 font-medium mt-1">{item.price} ETH</p>
        </div>
      ))}
    </section>
  )
}

export default ListView
