import { Link, useSearchParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ArrowUpRightIcon, ChevronDownIcon, LogOut, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, ShieldIcon, ShoppingCartIcon, SpaceIcon, UserIcon, XIcon } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { ApiSlice } from '../Feature/ApiSlice';
import { useDispatch } from 'react-redux';
const Navbar = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  //checkout user login or not
    const rawUser = localStorage.getItem('auth_user');
   const user = rawUser ? JSON.parse(rawUser) : null;

    const { cartCount, setIsCartOpen } = useContext(CartContext)
   const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery,setSearchQuery]=useState("")
  //search items set query
const handleSearchSubmit = (e) => {
  e.preventDefault(); 
  
  if (searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }
};
const [userMenuOpen,setUserMenuOpen]=useState(false)
//userlogout
const logoutUser=()=>{
localStorage.removeItem('token')
localStorage.removeItem('auth_user')
dispatch(ApiSlice.util.resetApiState());//reset api states after logout 
toast.success('Logout SuccessFully!')
navigate('/login')
}
    return (
        <nav className='bg-[#FFFFFF] sticky top-0 z-50 border-b border-[#e7e0d1]'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4'>

           <Link to="/" className='flex items-center gap-2 text-[22px] font-medium shrink-0'>
           <img src={assets.favicon} alt="" className='w-10 h-10'/> Supacart
           </Link>

           <div className='w-full flex items-center justify-end gap-4 lg:gap-10'>
            {/* navlink-desktops */}
            
           <div className='hidden md:flex items-center gap-6 text-sm text-zinc-600'>
           
            <Link to="/"  onClick={()=>window.scrollTo(0,0)}>Home</Link>
            <Link to="/products"  onClick={()=>window.scrollTo(0,0)}>Products</Link>
            <Link to="/deals" onClick={()=>window.scrollTo(0,0)}>Deals</Link>
           </div>

            <form action="" className='hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm' onSubmit={handleSearchSubmit}>
                <div className='relative w-full'>
                    <SearchIcon className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500'/>
                <input type="text" name="" id="" placeholder='Search for groceries ...' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='w-full pl-8 bg-orange-50 rounded-full ring ring-orange-600/15 focus:ring-orange-600/30 focus:outline-none py-1'/>
                </div>
            </form>
            {/* right-actions */}
            <div className='flex items-center gap-3'>
            {/* cart */}
            <button className='relative p-2 rounded-xl' onClick={()=>setIsCartOpen(true)}>
                <ShoppingCartIcon className='size-5 text-zinc-900'/>
                {cartCount >0 && <span className='absolute -top-1 -right-1 size-4 bg-orange-400 text-white text-[10px] rounded-full flex-center'>{cartCount}</span>}
            </button>
            {/* user */}
          <div className="relative">
  {user ? (
    <>
      <button className='flex items-center gap-2 p-2' onClick={() => setUserMenuOpen(true)}>
        <div className='size-7 rounded-full bg-green-950 text-white flex-center'>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <ChevronDownIcon className='size-3 text-zinc-500' />
      </button>
    </>
  ) : (
    <>
      <div className='flex-center gap-2'>
        <Link to="/login" className='hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-green-950 transition-colors'>
          <UserIcon size={16} />Sign In
        </Link>
        {userMenuOpen ? (
          <XIcon className='md:hidden' onClick={() => setUserMenuOpen(!userMenuOpen)} />
        ) : (
          <MenuIcon className='md:hidden' onClick={() => setUserMenuOpen(!userMenuOpen)} />
        )}
      </div>
    </>
  )}

  {userMenuOpen && (
    <>
     
      <div className='fixed inset-0 z-40' onClick={() => setUserMenuOpen(false)} />

      <div className='absolute right-0 top-full mt-2 w-56 bg-[#FFFFFF] rounded-xl shadow-lg border border-slate-300 py-2 z-50 animate-fade-in px-4'>
        {user && (
          <div className='py-2 border-b border-slate-300'>
            <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        )}
        <div onClick={() => setUserMenuOpen(false)}>
          {!user && <Link to="/login" className='dropdown-link'><UserIconSign size={16} />Sign In</Link>}
          {user && <Link to="/orders" className='dropdown-link'><PackageIcon size={16} />My Orders</Link>}
          {user && <Link to="/addresses" className='dropdown-link'><MapPinIcon size={16} />Addresses</Link>}
          <Link to="/products" className='dropdown-link md:hidden'><ArrowUpRightIcon size={16} />Products</Link>
          <Link to="/deals" className='dropdown-link md:hidden'><MapPinIcon size={16} />Deals</Link>
           <Link to="/deals" className='dropdown-link md:hidden'><ArrowUpRightIcon size={16} />Deals</Link>
          {user?.isAdmin && (
            <Link to="/admin/products" className='dropdown-link'>
              <ShieldIcon size={16} />
              Admin panel
            </Link>
          )}
          <div className='border-t border-slate-300'>
             <button className='dropdown-link md:hidden w-full' onClick={logoutUser}><LogOut size={16} />Logout</button>
          </div>
        </div>
      </div>
    </>
  )}
</div>
            </div>
           </div>
            </div>
        </nav>
    );
};

export default Navbar;