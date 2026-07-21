import { addMyProduct, deleteMyProduct, getMyFlashDeals, getMyProduct, getMyProducts, updateMyProduct } from "../Services/productServices.js"

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
//create product post
export const addProduct = async (req, res) => {
   
    const data  = req.body; 
    if(!data){
         return res.status(400).json({ success: false, message: "data not found!" });
    }
    try {
         const result = await addMyProduct(data);
        
       
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        
       
        return res.status(201).json({ success: true, message: "Product added successfully", product: result.message });
        
    } catch (error) {
       
        return res.status(500).json({ success: false, message: error.message });
    }
};
//update

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const  data  = req.body; 
    
    try {
        
        if (!id || !data) {
            return res.status(400).json({ success: false, message: "ID and Data are required!" });
        }

       
        const result = await updateMyProduct(id, data);

     
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message || "Update failed" });
        }

      
        return res.status(200).json({ 
            success: true, 
            message: "Product updated successfully", 
            product: result.product 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

//delete
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
   
     
    try {
        
        if (!id) {
            return res.status(400).json({ success: false, message: "ID are required!" });
        }

       
        const result = await deleteMyProduct(id);

     
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message || "product stock updated failed" });
        }

      
        return res.status(200).json({ 
            success: true, 
            message: "Product stock update success!", 
            product: result.product 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

