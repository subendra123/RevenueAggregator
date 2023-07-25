import {getSorted, Product} from "./ApiService";

type FilterScreenProps = {
    products: Product[]
    onClose: (products: Product[] | null) => void
}

const FilterScreen = ({products, onClose}: FilterScreenProps) => {
    const onApply = () => {
        onClose(products.filter((item) => item.selected));
    }
    return <div className={"filter-screen"}>
        <div className="filter-container">
            <div className={"filter-header"}>
                <h2>Filter products</h2>
                <div>
                    <button onClick={onApply}>Apply</button>
                    <button onClick={() => {
                        onClose(null);
                    }}><i className="ri-close-line"/></button>
                </div>
            </div>
            <div className={"filter-body"}>
                {getSorted(products).map((item, index) => (<div className={"filter-item"}>
                    <label htmlFor={"item-" + index}>{item.name}</label>
                    <input defaultChecked={item.selected} onChange={(e) => {
                        item.selected = e.target.checked;
                    }} id={"item-" + index} value={item.id} type={"checkbox"}/>
                </div>))}
            </div>
        </div>
    </div>;
}
export default FilterScreen;