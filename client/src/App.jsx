import { Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Rootlayout from "./pages/AppLayout";
import Product from "./pages/Product";
import SearchResult from "./pages/SearchResult";
import Deals from "./pages/FlashDeals";
import Checkout from "./pages/Checkout";
import Orders from "./pages/MyOrders";
import Addresses from "./pages/Addresses";
function App() {
  return (
   <Routes>
  
      <Route path="/login" element={<Login />} /> 
      
     
      <Route path="/" element={<Rootlayout />}>
       
        <Route path="products" element={<Product />} />
        <Route path="products/:id" element={<Product />} /> 
        <Route path="search" element={<SearchResult />} />
        <Route path="deals" element={<Deals />} />
        <Route path="checkout" element={<Checkout />} />
        
      
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<Orders />} />
        
        <Route path="addresses" element={<Addresses />} />
      </Route>
    </Routes>
  );
}

export default App;
