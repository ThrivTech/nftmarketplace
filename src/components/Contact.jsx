import React from 'react'

const Contact = ({ contactInfo }) => {
  return (
    <footer className="bg-gray-900 text-center text-white p-6">
      <p>Email: {contactInfo.email}</p>
      <p>Address: {contactInfo.address}</p>
      <p className="text-sm text-gray-500 mt-2">{contactInfo.copyright}</p>
    </footer>
  )
}


export default Contact
