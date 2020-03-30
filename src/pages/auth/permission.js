
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CommonTable from '@/components/Table/CommonTable'
import { connect } from 'dva';
import {Popconfirm, Button, message, Card, Row, Col, Form, Modal, Input, Select, TreeSelect  } from 'antd'

const ButtonGroup = Button.Group;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, treeValue, treeData, treeOnChange } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleAdd(fieldsValue)
    })
  }
  return (
    <Modal
      destroyOnClose
      title="创建菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入菜单名称'  }],
        })(<Input placeholder="请输入菜单名称" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="菜单类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请输入菜单类型'  }],
          initialValue:"menu"
        })(<Select style={{ width: 120 }}>
          <Select.Option value="menu">菜单</Select.Option>
          <Select.Option value="action">功能</Select.Option>
        </Select>)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="上级菜单">
        {form.getFieldDecorator('parentId', {
          setFieldsValue:treeValue
        })(<TreeSelect
          treeDataSimpleMode
          treeDefaultExpandAll="false"
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Please select"
          treeDefaultExpandAll
          onChange={treeOnChange}
        />)}
      </Form.Item>
    </Modal>
  )
})

const EditForm = Form.create()(props => {
  const { editModalVisible, form, handleSave, handleModalVisible, treeValue, treeData, treeOnChange, values:{name,type,parent_id} } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleSave(fieldsValue)
    })
  }
  console.log('tree',treeValue,parent_id,type)
  return (
    <Modal
      destroyOnClose
      title="修改菜单"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入菜单名称'  }],
          initialValue:name,
        })(<Input placeholder="请输入菜单名称" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="菜单类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请输入菜单类型'  }],
          initialValue:type,
        })(<Select style={{ width: 120 }}>
          <Select.Option value="menu">菜单</Select.Option>
          <Select.Option value="action">功能</Select.Option>
        </Select>)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="上级菜单">
        {form.getFieldDecorator('parentId', {
          setFieldsValue:treeValue,
          initialValue:parent_id,
        })(<TreeSelect
          treeDataSimpleMode
          treeDefaultExpandAll="false"
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Please select"
          treeDefaultExpandAll
          onChange={treeOnChange}
        />)}
      </Form.Item>
    </Modal>
  )
})

@connect(({ permissionModel,loading }) => ({
  permissionModel,
  loading: loading.models.permissionModel,
}))
export default class Permission extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      modalVisible: false,
      editModalVisible: false,
      values: {},
      treeValue:undefined,
    }
  }

  //选择上级菜单
  treeOnChange = value => {

    this.setState({ treeValue:value });
  };

  componentDidMount() {
    this.handleSearch(this.state.pageIndex, this.state.pageSize)
  }

  //获取列
  getColumns = () => {
    return [
      {
        title: '菜单名',
        dataIndex: 'name',
        key:'name',
        align:'left',
      },
      {
        title: '菜单类型',
        dataIndex: 'type.name',
        key:'type.name',
        align:'center',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key:'created_at',
        align:'center',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
              <ButtonGroup>
              <Button type="primary" onClick={() => this.edit(record)}>修改</Button>
              <Popconfirm title="确定要删除嘛?" onConfirm={() => this.handleDelete(record.id)}>
                <Button type="danger">删除</Button>
              </Popconfirm>
              </ButtonGroup>
          );
        },
        align:'center'
      },
    ];
  }

  //搜索操作
  handleSearch = (pageIndex, pageSize) => {
    const { dispatch } = this.props
    dispatch({
      type: 'permissionModel/getPermissionList',
      params: {
        pageIndex,
        pageSize,
      },
    })
  }

  edit = (values) => {
    console.log('菜单',values)
    this.getTreeList()
    this.setState({
      values: {...values,type:values.type.code}
    })
    this.editVisible(true)
  }

  //显示创建弹窗
  createVisible = flag => {
    this.getTreeList()
    this.setState({
      modalVisible: !!flag,
    })
  }

  //显示修改弹窗
  editVisible = (flag) => {
    this.setState({
      editModalVisible: !!flag,
    })
  }

  //删除操作
  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'permissionModel/delete',
      params: id,
      callback: () =>{
        message.success('删除菜单成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      }
    });
  }

  //创建操作
  handleAdd = (fields) => {
    const { dispatch } = this.props

    //跳到第一页
    this.setState({
      pageIndex: 1,
    })

    dispatch({
      type: 'permissionModel/create',
      params: fields,
      callback: () => {
        message.success('新建菜单成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      },
    })
    this.createVisible()
  }

  handleSave= (fields) => {
    const { dispatch } = this.props

    //跳到第一页
    this.setState({
      pageIndex: 1,
    })

    dispatch({
      type: 'permissionModel/save',
      id: this.state.values.id,
      params: fields,
      callback: () => {
        message.success('修改菜单成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      },
    })

    this.editVisible()

  }

  //获取树形列表
  getTreeList = () => {
    const {dispatch} = this.props
    dispatch({
      type: 'permissionModel/getTree',
    })

  }

  render(){
    const { permissionModel:{permissionList,permissionTrees  }, loading } = this.props

    const treeData = permissionTrees
    console.log('list',permissionList)
    return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col style={{ paddingBottom: 20 }}>
            <Button icon="plus" type="primary" onClick={() => this.createVisible(true)}>新建菜单</Button>
          </Col>
        </Row>
        <CommonTable
            datas={permissionList}
            loading={loading}
            columns={this.getColumns()}
            size='middle'
        />
      </Card>
      <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.createVisible}
          modalVisible={this.state.modalVisible}
          treeData={treeData}
          treeValue={this.state.treeValue}
          treeOnChange={this.treeOnChange}
        />
        <EditForm
          handleSave={this.handleSave}
          handleModalVisible={this.editVisible}
          editModalVisible={this.state.editModalVisible}
          treeData={treeData}
          treeValue={this.state.treeValue}
          treeOnChange={this.treeOnChange}
          values={this.state.values}
        />
    </PageHeaderWrapper>
    )
  }
}
