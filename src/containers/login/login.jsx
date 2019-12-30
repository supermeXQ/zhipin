import React, { Component } from "react";
import {
  WingBlank,
  NavBar,
  List,
  InputItem,
  Button,
  WhiteSpace
} from "antd-mobile";
import Logo from "../../components/logo/logo";
class Login extends Component {
  componentDidMount() {
    console.log("test");
  }
  render() {
    return (
      <div>
        <NavBar>Boss&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          <List style={{ marginTop: "100px" }}>
            <InputItem>用户名:</InputItem>
            <InputItem>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <Button type="primary">登录</Button>
            <Button
              onClick={() => {
                this.props.history.push("/register");
              }}>
              还没有账户
            </Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}
export default Login;
