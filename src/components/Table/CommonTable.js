import { Table } from 'antd';
import { PureComponent } from 'react';

class CommonTable extends PureComponent{
  constructor(props) {
    super(props);
  }

  render() {
    const {
      datas: { data, page },
      loading,
      columns,
      size,
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...page
    }
    const scroll = {
      x:true,
      y:500,
      scrollToFirstRowOnChange:true
    }
    console.log(data)
    return <Table
            dataSource={data}
            columns={columns}
            pagination={paginationProps}
            bordered
            loading={loading}
            scroll={scroll}
            rowKey="id"
            size={size}
            />;
  }
}
export default CommonTable;
