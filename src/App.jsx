import { DashBoard } from './Pages/DashBoard.jsx'
import { Footer } from './components/Footer.jsx'
import { Layout } from './components/Layout.jsx'

function App() {

  return (
    <>
      <Layout>
        <DashBoard />
        <Footer />
      </Layout>
    </>
  )
}

export default App