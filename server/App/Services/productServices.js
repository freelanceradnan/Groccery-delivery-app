import { Product } from "../Models/DefaultModel.js";

export async function getMyFlashDeals() { 
    try {
      
        const products = await Product.find({ stock: { $gt: 0 } })
                                      .sort({ originalPrice: -1 })
                                      .lean();

        const productDiscount = products.map((p) => {
           
            const discount = p.originalPrice && p.price 
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                : 0;
            return { ...p, discount };
        });

        return { success: true, message: productDiscount };
    } catch (error) {
        
        return { success: false, message: error.message }; 
    }
}
export const getMyProducts = async (category, search, minPrice, maxPrice, sort) => {
    try {
        const where = {};

       
        if (category && category !== "all") {
            where.category = category;
        }

      
        if (search) {
            where.name = { $regex: search, $options: "i" };
        }

       
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.$gte = Number(minPrice); 
            if (maxPrice) where.price.$lte = Number(maxPrice); 
        }

        
        let sortBy = {};
        if (sort === "price-low") {
            sortBy.price = 1;
        } else if (sort === "price-high") {
            sortBy.price = -1; 
        } else {
            sortBy.createdAt = -1;
        }

     
        const products = await Product.find(where)
                                      .sort(sortBy)
                                      .lean();
      
       
        const productsWithDiscount = products.map((p) => {
            const discount = p.originalPrice && p.price 
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                : 0;
            return { ...p, discount };
        });

        
        return ({ success:true,message: productsWithDiscount });
    } catch (error) {
        return({ error: error.message });
    }
};
export const getMyProduct = async (id) => {
    try {
      
        const product = await Product.findById(id).lean(); 
        
        if (!product) {
            return { success: false, message: "failed to get product" };
        }
        
        const discount = product.originalPrice && product.price 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
            : 0;
            
      
        return { success: true, message: { ...product, discount } };
    } catch (error) {
        return { success: false, message: "failed to get product" };
    }
};