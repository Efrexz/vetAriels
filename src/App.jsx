import { Routes, Route } from 'react-router-dom'
import Sales from './Pages/Sales.jsx'
import { DashBoard } from './Pages/DashBoard.jsx'
import { Footer } from './components/Footer.jsx'
import { Layout } from './components/Layout.jsx'

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
        <Footer />
      </Layout>
    </>
  )
}

export default App