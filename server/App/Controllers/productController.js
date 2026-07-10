import { getMyFlashDeals, getMyProduct, getMyProducts } from "../Services/productServices.js"

//get api/products/flash-deails
export const getFlashDeals=async(req,res)=>{
    try {
        const result=await getMyFlashDeals()
        if(!result){
        res.status(400).json({success:false,message:"failed to get products"})
        }
        res.status(200).json({success:true,message:result})
    } catch (error) {
        res.status(400).json({success:false,message:"failed to get products"})
    }
}
//get api/product/query {search,filter}
export const getProducts = async (req, res) => {
    try {
        
        const { category, search, minPrice, maxPrice, sort } = req.query;

       
        const result = await getMyProducts(category, search, minPrice, maxPrice, sort);

        if (!result.success) {
            
            return res.status(400).json({ success: false, message: result.error || 'Product get failed' });
        }
        
       
        return res.status(200).json({ 
            success: true, 
            products: result.message
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//get api/product/id
export const getProduct=async(req,res)=>{
    const {id}=req.params
    try {
        const result=await getMyProduct(id)
        if(!result.success){
            return res.status(400).json({success:false,message:"GetProduct Failed!"})
        }
        res.status(200).json({success:true,message:result.message})
    } catch (error) {
        res.status(200).json({success:false,message:"GetProduct Failed!"})
    }
}

