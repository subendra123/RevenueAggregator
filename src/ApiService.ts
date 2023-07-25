export type Product = {
    id: string;
    name: string;
    unitPrice: number;
    sold: number;
    selected: boolean;
}


const currencyOptions = {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
};
export const getRevenue = (price: number, sold: number): number => (price * sold);


export const formatCurrency = (num: number): string => num.toLocaleString("en-IN", currencyOptions);

export const totalRevenue = (products: Product[]): number => {
    return products.reduce((sum, curr) => {
        return sum + getRevenue(curr.unitPrice, curr.sold)
    }, 0);
}

export const getSorted = (products: Product[]): Product[] => {
    return products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
}

const ApiService = {
    async getProducts(branch: string): Promise<Product[]> {
        return fetch(`${branch}.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => {
            if (res.ok) return res.json();
        }).then(res => {
            return res["products"];
        });
    }
}

export default ApiService;