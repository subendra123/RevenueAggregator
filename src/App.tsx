import React, {useEffect, useState} from 'react';
import './App.css';
import ApiService, {formatCurrency, getRevenue, getSorted, Product, totalRevenue} from "./ApiService";
import FilterScreen from "./FilterScreen";
import 'remixicon/fonts/remixicon.css'


function App() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const loadData = async () => {
        let p1 = await ApiService.getProducts(`branch1`);
        let p2 = await ApiService.getProducts(`branch2`);
        let p3 = await ApiService.getProducts(`branch3`);
        let p1p2 = mergeProducts(p1, p2);
        let p1p2p3 = mergeProducts(p1p2, p3);
        setAllProducts(p1p2p3);
        setProducts(p1p2p3);
    }


    const mergeProducts = (a: Product[], b: Product[]): Product[] => {

        a.forEach((item) => {
            let tarObj = b.find((obj) => obj.id === item.id);
            if (tarObj) {
                item.sold = item.sold + tarObj.sold;
                let y = tarObj;
                b = b.filter((x) => x.id != y.id);
            }
            b.push(item);
        })
        return b;
    }

    useEffect(() => {
        loadData();
    }, []);

    const filterResults = (text: string) => {
        if (text.trim() == "") {
            setProducts(allProducts);
            return;
        }
        allProducts.forEach((item) => item.selected = false)
        setProducts(allProducts.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())));
    }
    return (
        <>
            <div className="container">
                <div>
                    <div className={"header in"}>
                        <div>
                            <h2>Revenue</h2>
                            <h4>Aggregator</h4>
                        </div>
                        <div>
                            <button onClick={() => {
                                setShowFilter(!showFilter);
                            }}><i className="ri-filter-3-fill"/>
                            </button>
                            <input onChange={(e) => filterResults(e.target.value)} className={"search-input"}
                                   placeholder={"Search"}/>
                        </div>
                    </div>
                    <table className="body">
                        <thead>
                        <tr>
                            <th className={"text-center w-80"}>SN</th>
                            <th>Product</th>
                            <th className={"text-center"}>Total Revenue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.length == 0 ?
                            <tr className={"no-product"} key={"product-na"}>
                                <td colSpan={3} className={"text-center"}>No products found!</td>
                            </tr> : null}
                        {getSorted(products).map(({
                                                      name,
                                                      sold,
                                                      unitPrice
                                                  }, index) => (
                            <tr key={"product-" + index}>
                                <td className={"text-center"}>{index + 1}</td>
                                <td>{name}</td>
                                <td className={"text-center"}>{formatCurrency(getRevenue(unitPrice, sold))}</td>
                            </tr>
                        ))}
                        </tbody>
                        {products.length > 0 ? <tfoot>
                        <tr>
                            <th colSpan={2}>Total</th>
                            <th className={"text-center"}>{formatCurrency(totalRevenue(products))}</th>
                        </tr>
                        </tfoot> : null}
                    </table>
                </div>
            </div>
            {showFilter ? <FilterScreen onClose={(products) => {
                setShowFilter(false);
                if (products == null) return;
                if (products.length > 0) {
                    setProducts(products);
                } else {
                    setProducts(allProducts);
                }
            }} products={allProducts}/> : null}

        </>
    );
}

export default App;
