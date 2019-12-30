import React, { Component } from "react";
import { createForm } from "rc-form";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
  Icon,
  Toast
} from "antd-mobile";
import Logo from "../../components/logo/logo";
const ListItem = List.Item;
class Register extends Component {
  state = {
    userName: "",
    password: "",
    password2: "",
    type: "dasheng"
  };
  handleChange = (name, val) => {
    console.log(name, val);
    console.log([name]);
    this.setState({
      [name]: val
    });
  };
  toLogin = () => {
    this.props.history.push("/login");
  };
  register = () => {
    this.setState(
      () => ({
        userName: this.props.form.getFieldValue("username"),
        password: this.props.form.getFieldValue("password"),
        password2: this.props.form.getFieldValue("password2")
      }),
      () => {
        console.log(this.state.type);
        if (this.state.password === this.state.password2) {
          alert("注册成功");
        } else {
          alert("密码前后不一致,请确认后再提交");
        }
      }
    );
  };
  render() {
    const { type } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <NavBar mode="dark">Boss&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          <List>
            <WhiteSpace />
            <InputItem
              {...getFieldProps("username")}
              placeholder="请输入用户名或手机号">
              用户名:
            </InputItem>
            <WhiteSpace />
            <InputItem {...getFieldProps("password")} placeholder="请输入密码">
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace />
            <InputItem {...getFieldProps("password2")}>确认密码:</InputItem>
            <WhiteSpace />
            <ListItem>
              <span>用户类型:</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                checked={type == "dasheng" ? true : false}
                onChange={() => {
                  this.handleChange("type", "dasheng");
                }}>
                大神
              </Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                checked={type == "laoban" ? true : false}
                onChange={() => {
                  this.handleChange("type", "laoban");
                }}>
                老板
              </Radio>
            </ListItem>
            <WhiteSpace />
            <Button type="primary" onClick={this.register}>
              注&nbsp;&nbsp;&nbsp;册
            </Button>
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}
const RegisterForm = createForm()(Register);
export default RegisterForm;
