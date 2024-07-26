import { HeroSection } from './components/HeroSection.jsx'
import { Footer } from './components/Footer.jsx'
import { Layout } from './components/Layout.jsx'

function App() {

  return (
    <>
      <Layout>
        <HeroSection />
        <Footer />
      </Layout>
    </>
  )
}

export default App