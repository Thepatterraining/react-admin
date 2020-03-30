
import styles from './users.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CommonTable from '@/components/Table/CommonTable'
import { connect } from 'dva';
import {Popconfirm, Button, message, Card, Row, Col, Form, Modal, Input, Select } from 'antd'

const ButtonGroup = Button.Group;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleChange, roleList:{data} } = props

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
      title="创建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名称'  }],
        })(<Input placeholder="请输入用户名称" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户邮箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: true, message: '请输入用户邮箱'  }],
        })(<Input placeholder="请输入用户邮箱" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入用户密码'  }],
        })(<Input placeholder="请输入用户密码" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleIds', {
          rules: [{ required: true, message: '请选择角色'  }],
        })( <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择角色"
          // defaultValue={['a10', 'c12']}
          onChange={handleChange}
        >
          {data.map(t => {
           return <Option key={t.id} value={t.id} >{t.name}</Option>
          })}
        </Select>)}
      </Form.Item>
    </Modal>
  )
})

const EditForm = Form.create()(props => {
  const { editModalVisible, form, handleSave, handleModalVisible, values:{name, email, roleIds}, handleChange, roleList:{data} } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleSave(fieldsValue)
    })
  }
  console.log('默认值',name,email,roleIds)
  return (
    <Modal
      destroyOnClose
      title="修改用户"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名称'  }],
          initialValue:name
        })(<Input placeholder="请输入用户名称" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户邮箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: true, message: '请输入用户邮箱'  }],
          initialValue:email
        })(<Input placeholder="请输入用户邮箱" />)}
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleIds', {
          rules: [{ required: true, message: '请选择角色'  }],
          initialValue:roleIds
        })( <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择角色"
          // defaultValue={['a10', 'c12']}
          onChange={handleChange}
        >
          {data.map(t => {
           return <Option key={t.id} value={t.id} >{t.name}</Option>
          })}
        </Select>)}
      </Form.Item>
    </Modal>
  )
})

@connect(({ userList,loading,roleModel }) => ({
  userList,
  loading: loading.models.userList,
  roleModel,
  roleLoading: loading.models.roleModel,
}))
export default class Users extends React.PureComponent{
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
        title: '用户名',
        dataIndex: 'name',
        key:'name',
        align:'center',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key:'email',
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
      type: 'userList/getUserList',
      params: {
        pageIndex,
        pageSize,
      },
    })
  }

  //获取角色列表
  getRoles = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'roleModel/getRoleList',
      params: {
        pageIndex:1,
        pageSize:10000,
      },
    })
  }

  edit = (values) => {
    console.log('value:',values)
    this.setState({
      values: values
    })
    this.editVisible(true)
  }

  //显示创建弹窗
  createVisible = flag => {
    //获取角色列表
    this.getRoles()
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
      type: 'userList/delete',
      params: id,
      callback: () =>{
        message.success('删除用户成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      }
    });
  }

  //创建操作
  handleAdd = (fields) => {
    const { dispatch } = this.props
    const newFieldsValue = {
      name: fields.name,
      email: fields.email,
      password: fields.password,
      roleIds: fields.roleIds,
    }
    //跳到第一页
    this.setState({
      pageIndex: 1,
    })

    dispatch({
      type: 'userList/create',
      params: newFieldsValue,
      callback: () => {
        message.success('新建用户成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      },
    })
    this.createVisible()
  }

  handleSave= (fields) => {
    const { dispatch } = this.props
    console.log('表单',this.state.values)
    const newFieldsValue = {
      name: fields.name,
      email: fields.email,
      roleIds: fields.roleIds,
    }
    //跳到第一页
    this.setState({
      pageIndex: 1,
    })

    dispatch({
      type: 'userList/save',
      id: this.state.values.id,
      params: newFieldsValue,
      callback: () => {
        message.success('修改用户成功！')
        this.handleSearch(this.state.pageIndex, this.state.pageSize)
      },
    })

    this.editVisible()

  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }


  render(){
    const { userList:{userList}, loading, roleModel:{roleList} } = this.props
    console.log('props:',this.props)
    console.log('load',loading)
    console.log('roles',roleList)

    return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col style={{ paddingBottom: 20 }}>
            <Button icon="plus" type="primary" onClick={() => this.createVisible(true)}>新建用户</Button>
          </Col>
        </Row>
        <CommonTable
            datas={userList}
            loading={loading}
            columns={this.getColumns()}
            size='middle'
        />
      </Card>
      <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.createVisible}
          modalVisible={this.state.modalVisible}
          roleList={roleList}
          handleChange={this.handleChange}
        />
        <EditForm
          handleSave={this.handleSave}
          handleModalVisible={this.editVisible}
          editModalVisible={this.state.editModalVisible}
          values={this.state.values}
          roleList={roleList}
          handleChange={this.handleChange}
        />
    </PageHeaderWrapper>
    )
  }
}
