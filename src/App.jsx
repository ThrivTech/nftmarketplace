import NavigationBar from './components/NavigationBar'
import ListView from './components/ListView'
import Contact from './components/Contact'
 


function App() {
  const navLinks = [
    { title: 'Home', href: '#' },
    { title: 'Explore', href: '#' },
    { title: 'Marketplace', href: '#' },
    { title: 'Contact', href: '#' },
  ]

  const nftItems = [
    {
      image: 'https://via.placeholder.com/200x200.png?text=NFT+1',
      name: 'Cyber Punk Ape',
      owner: '@johnDoe',
      price: '2.5',
    },
    {
      image: 'https://via.placeholder.com/200x200.png?text=NFT+2',
      name: 'Pixel Art Hero',
      owner: '@saraCrypto',
      price: '1.2',
    },
    {
      image: 'https://via.placeholder.com/200x200.png?text=NFT+3',
      name: 'Meta Robot',
      owner: '@robotMan',
      price: '3.1',
    },
  ]

  const contactInfo = {
    email: 'support@nftstorm.com',
    address: '123 Web3 Lane, Blockchain City',
    copyright: '© 2025 NFTStorm',
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <NavigationBar links={navLinks} />
      <ListView items={nftItems} />
      <Contact contactInfo={contactInfo} />
    </div>
  )
}

export default App
