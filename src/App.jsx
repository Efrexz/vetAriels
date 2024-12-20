import { Routes, Route, useLocation } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext.jsx';
import { ClientsProvider } from './context/ClientsContext';
import { ProductsAndServicesProvider } from './context/ProductsAndServicesContext.jsx';
import { FinancialProvider } from './context/FinancialContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { DashBoard } from './Pages/DashBoard.jsx';
import { Login } from './Pages/Login.jsx';
import { Sales } from './Pages/sales/Sales.jsx';
import { ActiveOrders } from './Pages/sales/ActiveOrders.jsx';
import { Invoices } from './Pages/sales/Invoices.jsx';
import { CreateInvoice } from './Pages/sales/CreateInvoice.jsx';
import { BalanceReport } from './Pages/sales/BalanceReport.jsx';
import { Payments } from './Pages/sales/Payments.jsx';
import { ClinicQueue } from './Pages/ClinicQueue.jsx';
import { Internments } from './Pages/Internments.jsx';
import { ActiveOrdersGrooming } from './Pages/grooming/ActiveOrdersGrooming.jsx';
import { GroomingHistory } from './Pages/grooming/GroomingHistory.jsx';
import { GroomingOrderCreation } from './Pages/grooming/GroomingOrderCreation.jsx';
import { EditGroomingOrder } from './Pages/grooming/EditGroomingOrder.jsx';
import { Clients } from './Pages/Clients.jsx';
import { CreateClientForm } from './Pages/CreateClientForm.jsx';
import { ClientInfo } from './Pages/clientData.jsx/ClientInfo.jsx';
import { PetsData } from './Pages/PetsData.jsx';
import { CreatePetForm } from './Pages/CreatePetForm.jsx';
import { PetInfo } from './Pages/petInfo/PetInfo.jsx';
import { Products } from './Pages/products/Products.jsx';
import { ProductInfo } from './Pages/products/ProductInfo.jsx';
import { Discharges } from './Pages/products/Discharges.jsx';
import { Charges } from './Pages/products/Charges.jsx';
import { DischargeAndChargeStock } from './Pages/products/DischargeAndChargeStock.jsx';
import { OperationInfo } from './Pages/products/operationInfo.jsx/OperationInfo.jsx';
import { Services } from './Pages/servicesSection/Services.jsx';
import { ServiceInfo } from './Pages/servicesSection/ServiceInfo.jsx';
import { Config } from './Pages/configurationSection/Config.jsx';
import { FiscalData } from './Pages/configurationSection/FiscalData.jsx';
import { VoucherConfiguration } from './Pages/configurationSection/VoucherConfiguration.jsx';
import { PaymentMethods } from './Pages/configurationSection/PaymentMethods.jsx';
import { Roles } from './Pages/configurationSection/Roles.jsx';
import { CreateRol } from './Pages/configurationSection/CreateRol.jsx';
import { PermissionsList } from './Pages/configurationSection/PermissionsList.jsx';
import { Users } from './Pages/configurationSection/Users.jsx';
import { CreateUser } from './Pages/configurationSection/CreateUser.jsx';
import { EditUser } from './Pages/configurationSection/EditUser.jsx';
import { UserInfo } from './Pages/configurationSection/UserInfo/index.jsx';
import { NotFound } from './Pages/NotFound.jsx';
import { Footer } from './components/Footer.jsx';
import { Layout } from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import './index.css';

function App() {
  const location = useLocation();

  return (
    <GlobalProvider>
      <FinancialProvider>
        <ClientsProvider>
          <ProductsAndServicesProvider>
            {/* Solo renderizar Layout si no estamos en la ruta de login */}
            {location.pathname !== '/login' ? (
              <Layout>
                <ScrollToTop />
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<DashBoard />} />
                    <Route path="/sales/client/:id" element={<Sales />} />
                    <Route path="/sales/active-orders" element={<ActiveOrders />} />
                    <Route path="/sales/invoices" element={<Invoices />} />
                    <Route path="/sales/invoices/create/:id" element={<CreateInvoice />} />
                    <Route path="/sales/payments" element={<Payments />} />
                    <Route path="/sales/cash-review" element={<BalanceReport />} />
                    <Route path="/clinic-queue" element={<ClinicQueue />} />
                    <Route path="/internments" element={<Internments />} />
                    <Route path="/grooming" element={<ActiveOrdersGrooming />} />
                    <Route path="/grooming/history" element={<GroomingHistory />} />
                    <Route path="/grooming/order-creation/:id" element={<GroomingOrderCreation />} />
                    <Route path="/grooming/update/:id" element={<EditGroomingOrder />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/create" element={<CreateClientForm />} />
                    <Route path="/clients/client/:id/:section" element={<ClientInfo />} />
                    <Route path="/pets" element={<PetsData />} />
                    <Route path="/pets/create/:id" element={<CreatePetForm />} />
                    <Route path="/pets/pet/:id/:section" element={<PetInfo />} />
                    <Route path="/products" element={<Products />} />
                    <Route path='/products/product/:id/:section' element={<ProductInfo />} />
                    <Route path="/discharges" element={<Discharges />} />
                    <Route path="/charges" element={<Charges />} />
                    <Route path="/charges/create" element={<DischargeAndChargeStock typeOfOperation="restock" />} />
                    <Route path="/charges/charge/:id/:section" element={<OperationInfo typeOfOperation="restock" />} />
                    <Route path="/discharges/create" element={<DischargeAndChargeStock typeOfOperation="discharge" />} />
                    <Route path="/discharges/discharge/:id/:section/" element={<OperationInfo typeOfOperation="discharge" />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/service/:id/:section" element={<ServiceInfo />} />
                    <Route path="/config/subsidiary" element={<Config />} />
                    <Route path="/config/fiscal-data" element={<FiscalData />} />
                    <Route path="/config/invoice-types" element={<VoucherConfiguration />} />
                    <Route path="/config/payment-methods" element={<PaymentMethods />} />
                    <Route path="/config/roles" element={<Roles />} />
                    <Route path="/config/roles/create" element={<CreateRol />} />
                    <Route path="/config/role/permissions/:role" element={<PermissionsList />} />
                    <Route path="/config/user-subsidiaries" element={<Users />} />
                    <Route path="/config/user-subsidiaries/create" element={<CreateUser />} />
                    <Route path="/config/user-subsidiaries/edit/:id" element={<EditUser />} />
                    <Route path="/config/profile/:id/:section" element={<UserInfo />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
                <Footer />
              </Layout>
            ) : (
              // Solo renderizar la página de Login sin el Layout
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </ProductsAndServicesProvider>
        </ClientsProvider>
      </FinancialProvider>
    </GlobalProvider>
  );
}

export default App;