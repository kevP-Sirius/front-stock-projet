import axios from "axios";
const qs = require('qs');
let SearchBar = ()=>{
    const [formSearch, setFormSearch] = useState({product:''});
    const [elementList, setElementList] = useState([]);
    
    let handleSubmitSearch =(event)=>{
        event.preventDefault()
        let data = qs.stringify({designation:formSearch.product})
        axios.post(`${baseUrlToUse}${urlToSearch}`,data).then((response)=>{
            SetProducts([...response.data])
        })
    }
    let handleChangeSearch = (event)=>{
        let {name,value} = event.target
        setFormSearch({...formSearch,[name]:value});
    }
    return(
    <>
        <form onSubmit={handleSubmitSearch}>
            <div className="form-group">
            <label htmlFor="titre">Rechercher un produit </label>
            <input type="text" onChange={handleChangeSearch} value={formSearch.product} className="form-control" id="designation" name="product" list="productList"/>
            <datalist id="productList">
                {
                    elementList.map((element,index)=>{
                      return  <option key={index} value={product.designation}>{product.designation}</option>
                    })
                }
            </datalist>
            </div>
            <button type="submit" className="mt-3 mb-3 btn btn-primary">Rechercher</button>
        </form>
    </>
    )
}
