

import { connect } from 'dva';
import Products from '../../components/Products/Products';

const ProductList = ({ dispatch, products }) => {
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }
  return (
    <div>
      <h2>List of Products</h2>
      <Products onDelete={handleDelete} products={products} />
    </div>
  );
};

export default connect(({ ProductList }) => ({
  ProductList,
}))(ProductList);
