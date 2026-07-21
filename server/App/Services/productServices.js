import { Product } from "../Models/DefaultModel.js";
//get flash product
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
//getmyproducts
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
//getsingle product withid
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
//create product
export const addMyProduct = async (data) => {
    
    try {
        const defaultReview={
            rating:4.5,
            reviewCount:12
        }
       
        const newProduct = new Product({
  ...data,
  ...defaultReview,
});
        const savedProduct = await newProduct.save();
        return { success: true, message: savedProduct };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//update product
export const updateMyProduct = async (id, data) => {
    try {
        
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
       
        if (!updatedProduct) {
            return { success: false, message: "Product not found" };
        }

        return { success: true, product: updatedProduct };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
//delete product
export const deleteMyProduct = async (id) => {
    try {
        
        const updatedProduct = await Product.findByIdAndUpdate({_id:id},{
            $set:{stock: 0}
        })
       
        if (!updatedProduct) {
            return { success: false, message: "Failed to Remove Product Stock!" };
        }

        return { success: true,message:"Product Stock Reduce Success!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};