export function checkQuantitySize(items) {
    try {
        // Create a map to track quantities by productId and sizeId combination
        const productSizeMap = new Map();
        
        // Iterate through items and aggregate quantities sequentially
        items.forEach((item, index) => {
            const key = `${item.productId}_${item.sizeId}`;
            
            if (productSizeMap.has(key)) {
                // If combination exists, add to existing quantity
                const existing = productSizeMap.get(key);
                existing.itemIndices.push({
                    index: index,
                    qty: item.qty,
                    cumulativeQty: existing.cumulativeQty + item.qty
                });
                existing.cumulativeQty += item.qty;
            } else {
                // Create new entry for this product-size combination
                productSizeMap.set(key, {
                    sizeQuantity: item.sizeQuantity,
                    cumulativeQty: item.qty,
                    itemIndices: [{
                        index: index,
                        qty: item.qty,
                        cumulativeQty: item.qty
                    }]
                });
            }
        });
        
        // Add stockAvailable field to each item based on cumulative quantity at that point
        const updatedItems = items.map((item, index) => {
            const key = `${item.productId}_${item.sizeId}`;
            const data = productSizeMap.get(key);
            
            // Find this item's cumulative quantity
            const itemData = data.itemIndices.find(i => i.index === index);
            let stockAvailable = itemData.cumulativeQty <= data.sizeQuantity;
             if(stockAvailable&& item.onlineProduct==false){
                stockAvailable=false
             }
            return {
                ...item,
                stockAvailable: stockAvailable
            };
        });
        return updatedItems;
        
    } catch (error) {
        console.error('Error in checkQuantitySize:', error);
        return items.map(item => ({
            ...item,
            stockAvailable: false
        }));
    }
}
