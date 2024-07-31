import { Routes, Route } from 'react-router-dom'
import { DashBoard } from './Pages/DashBoard.jsx'
import { Sales } from './Pages/Sales.jsx'
import { ActiveOrders } from './Pages/ActiveOrders.jsx'
import { Invoices } from './Pages/Invoices.jsx'
import { Payments } from './Pages/Payments.jsx'
import { Footer } from './components/Footer.jsx'
import { Layout } from './components/Layout.jsx'

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/active-orders" element={<ActiveOrders />} />
          <Route path="/sales/invoices" element={<Invoices />} />
          <Route path="/sales/payments" element={<Payments />} />

          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
        <Footer />
      </Layout>
    </>
  )
}

export default App