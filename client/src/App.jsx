import { Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Rootlayout from "./pages/AppLayout";
import Product from "./pages/Product";
import SearchResult from "./pages/SearchResult";
import Deals from "./pages/FlashDeals";
import Checkout from "./pages/Checkout";
import Orders from "./pages/MyOrders";
import Addresses from "./pages/Addresses";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminOrders from "./pages/AdminOrders";
import AdminDeliveryPartners from "./pages/AdminDeliveryPartners";
import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import DeliveryLayout from "./pages/DeliveryLayout";
import ProtectedUser from "./components/ProtectedUser";
import DeliveryProtected from "./components/DeliveryProtected";
import { DeliveryPublic } from "./components/DeliveryPublic";
import { NotFound } from "./pages/NotfoundPage";

function App() {
  return (
   <Routes>
  
  <Route path="/" element={<Rootlayout />}>
    <Route index element={<Home />} /> 

    <Route path="products" element={<Product />} />
    <Route path="products/:id" element={<ProductPage/>} /> 
    <Route path="search" element={<SearchResult />} />
    <Route path="deals" element={<Deals />} />
   
    <Route path="" element={<ProtectedUser/>}>
     <Route path="checkout" element={<Checkout />} />
      <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetails/>} />
    <Route path="addresses" element={<Addresses />} />
    </Route>
  </Route>
  {/* adminpages */}
  <Route path="/admin" element={<AdminLayout/>}>
   <Route index element={<AdminDashboard/>}/>
   <Route path="products" element={<AdminProducts/>}/>
   <Route path="products/new" element={<AdminProductForm/>}/>
   <Route path="products/:id/edit" element={<AdminProductForm/>}/>
   <Route path="orders" element={<AdminOrders/>}/>
   <Route path="delivery-partners" element={<AdminDeliveryPartners/>}/>
  </Route>
  {/* delivery-routes */}
  <Route element={<DeliveryPublic />}>
          <Route path="/delivery/login" element={<DeliveryLogin />} />
        </Route>
 <Route element={<DeliveryProtected />}>
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<DeliveryDashboard />} />
          </Route>
        </Route>
<Route path="/login" element={<Login />} />
<Route path="*" element={<NotFound/>}/>
</Routes>
  );
}

export default App;
