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
function App() {
  return (
   <Routes>
  
  <Route path="/" element={<Rootlayout />}>
    <Route index element={<Home />} /> 

    <Route path="products" element={<Product />} />
    <Route path="products/:id" element={<ProductPage/>} /> 
    <Route path="search" element={<SearchResult />} />
    <Route path="deals" element={<Deals />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetails/>} />
    <Route path="addresses" element={<Addresses />} />
  </Route>

  <Route path="/login" element={<Login />} /> 
</Routes>
  );
}

export default App;
