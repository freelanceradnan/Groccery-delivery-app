import { getMyFlashDeals, getMyProduct } from "../Services/productServices.js"

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
//get api/product ? query
export const getProducts = async (req, res) => {
    try {
        
        const { category, search, minPrice, maxPrice, sort } = req.query;

       
        const result = await getMyProduct(category, search, minPrice, maxPrice, sort);

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

