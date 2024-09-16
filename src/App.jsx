import { GlobalProvider } from './context/GlobalContext.jsx'
import { ClientsProvider } from './context/ClientsContext'
import { Routes, Route } from 'react-router-dom'
import { DashBoard } from './Pages/DashBoard.jsx'
import { Sales } from './Pages/sales/Sales.jsx'
import { ActiveOrders } from './Pages/sales/ActiveOrders.jsx'
import { Invoices } from './Pages/sales/Invoices.jsx'
import { Payments } from './Pages/sales/Payments.jsx'
import { ClinicQueue } from './Pages/ClinicQueue.jsx'
import { Internments } from './Pages/Internments.jsx'
import { ActiveOrdersGrooming } from './Pages/grooming/ActiveOrdersGrooming.jsx'
import { GroomingHistory } from './Pages/grooming/GroomingHistory.jsx'
import { Clients } from './Pages/Clients.jsx'
import { CreateClientForm } from './Pages/CreateClientForm.jsx'
import { ClientInfo } from './Pages/clientData.jsx/ClientInfo.jsx'
import { PetsData } from './Pages/PetsData.jsx'
import { CreatePetForm } from './Pages/CreatePetForm.jsx'
import { PetInfo } from './Pages/petInfo/PetInfo.jsx'
import { Products } from './Pages/products/Products.jsx'
import { Discharges } from './Pages/products/Discharges.jsx'
import { Charges } from './Pages/products/Charges.jsx'
import { Services } from './Pages/Services.jsx'
import { Config } from './Pages/Config.jsx'
import { Footer } from './components/Footer.jsx'
import { Layout } from './components/Layout.jsx'

function App() {

  return (
    <>
      <GlobalProvider>
        <ClientsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales/active-orders" element={<ActiveOrders />} />
              <Route path="/sales/invoices" element={<Invoices />} />
              <Route path="/sales/payments" element={<Payments />} />
              <Route path="/clinic-queue" element={<ClinicQueue />} />
              <Route path="/internments" element={<Internments />} />
              <Route path="/grooming" element={<ActiveOrdersGrooming />} />
              <Route path="/grooming/history" element={<GroomingHistory />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/create" element={<CreateClientForm />} />
              <Route path="/clients/client/:id/:section" element={<ClientInfo />} />
              <Route path="/pets" element={<PetsData />} />
              <Route path="/pets/create/:id" element={<CreatePetForm />} />
              <Route path="/pets/pet/:id/:section" element={<PetInfo />} />
              <Route path="/products" element={<Products />} />
              <Route path="/discharges" element={<Discharges />} />
              <Route path="/charges" element={<Charges />} />
              <Route path="/services" element={<Services />} />
              <Route path="/config/subsidiary" element={<Config />} />
              <Route path="*" element={<h1>404 Page Not Found</h1>} />
            </Routes>
            <Footer />
          </Layout>
        </ClientsProvider>
      </GlobalProvider>

    </>
  )
}

export default App