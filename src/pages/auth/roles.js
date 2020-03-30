
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CommonTable from '@/components/Table/CommonTable'
import { connect } from 'dva';
import {Popconfirm, Button, message, Card, Row, Col, Form, Modal, Input } from 'antd'

const ButtonGroup = Button.Group;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props

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
      title="创建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称'  }],
        })(<Input placeholder="请输入角色名称" />)}
      </Form.Item>
    </Modal>
  )
})

const EditForm = Form.create()(props => {
  const { editModalVisible, form, handleSave, handleModalVisible, values:{name} } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleSave(fieldsValue)
    })
  }
  return (
    <Modal
      destroyOnClose
      title="修改角色"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称'  }],
          initialValue:name
        })(<Input placeholder="请输入角色名称" />)}
      </Form.Item>
    </Modal>
  )
})

@connect(({ roleModel,loading }) => ({
  roleModel,
  loading: loading.models.roleModel,
}))
export default class Roles extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 1,
      pageSize: 10,
      modalVisible: false,
      editModalVisible: false,
      values: {},
    }
  }

  componentDidMount() {
    this.handleSearch(this.state.pageIndex, this.state.pageSize)
  }

  //获取列
  getColumns = () => {
    return [
      {
        title: '角色名',
        dataIndex: 'name',
        key:'name',
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
      type: 'roleModel/getRoleList',
      params: {
        pageIndex,
        pageSize,
      },
    })
  }

  edit = (values) => {
    this.setState({
      values: values
    })
    this.editVisible(true)
  }

  //显示创建弹窗
  createVisible = flag => {
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
      type: 'roleModel/delete',
      params: id,
      callback: () =>{
        message.success('删除角色成功！')
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
      type: 'roleModel/create',
      params: fields,
      callback: () => {
        message.success('新建角色成功！')
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
      type: 'roleModel/save',
      id: this.state.values.id,
      params: fields,
      callback: () => {
        message.success('修改角色成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      },
    })

    this.editVisible()

  }


  render(){
    const { roleModel:{roleList}, loading } = this.props
    return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col style={{ paddingBottom: 20 }}>
            <Button icon="plus" type="primary" onClick={() => this.createVisible(true)}>新建角色</Button>
          </Col>
        </Row>
        <CommonTable
            datas={roleList}
            loading={loading}
            columns={this.getColumns()}
            size='middle'
        />
      </Card>
      <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.createVisible}
          modalVisible={this.state.modalVisible}
        />
        <EditForm
          handleSave={this.handleSave}
          handleModalVisible={this.editVisible}
          editModalVisible={this.state.editModalVisible}
          values={this.state.values}
        />
    </PageHeaderWrapper>
    )
  }
}
