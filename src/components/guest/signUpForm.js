import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import firebase from '../../fbConfig';

// components
import ComfyForm, { FormItemWrapper } from '../ui/comfyForm';
import ProcessNav from '../ui/processNav';
import ArrowIconLink from '../ui/arrowIconLink';
import NextStepButton from '../ui/nextStepButton';

// contexts
import { loadingContext } from '../contexts/loadingContext';

// actions
import { signUp } from '../../actions/authActions';

//settings
// const sendNewUserNotification = firebase
//   .functions()
//   .httpsCallable('sendNewUserNotification');

class SignUpForm extends Component {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickName: '',
    message: ''
  };

  static contextType = loadingContext;

  loadingStart = () => {
    this.context.setLoadingBarActive(true);
  };

  loadingEnd = () => {
    this.context.setLoadingBarActive(false);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const password = this.state.password;
    const passwordConfirm = this.state.passwordConfirm;

    if (password !== passwordConfirm) {
      alert('密碼確認欄輸入錯誤');
    } else {
      this.loadingStart();
      signUp(this.state).then(() => {
        this.loadingEnd();
        this.props.history.push('/signUpSuccess');
      });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <ComfyForm submitHandler={this.handleSubmit}>
        <FormItemWrapper className="col-12 col-md-6">
          <label>帳號</label>
          <input
            name="email"
            type="text"
            onChange={this.handleChange}
            placeholder="請輸入信箱"
            required
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-12 col-md-6">
          <label>密碼</label>
          <input
            name="password"
            type="password"
            onChange={this.handleChange}
            placeholder="至少6位數之密碼"
            required
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-12 col-md-6">
          <label>確認密碼</label>
          <input
            name="passwordConfirm"
            type="password"
            onChange={this.handleChange}
            placeholder="再次輸入密碼"
            required
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-12 col-md-6">
          <label>姓名</label>
          <input
            name="name"
            type="text"
            onChange={this.handleChange}
            placeholder="你的名字"
            required
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-12 col-md-6">
          <label>暱稱</label>
          <input
            name="nickName"
            type="text"
            onChange={this.handleChange}
            placeholder="a.k.a"
            required
          />
        </FormItemWrapper>
        <FormItemWrapper className="col-12">
          <label>訊息</label>
          <textarea
            name="message"
            cols="30"
            rows="10"
            onChange={this.handleChange}
            placeholder="請輸入訊息，讓芝伊認識你"
            required
          ></textarea>
        </FormItemWrapper>
        <FormItemWrapper className="col-12">
          <ProcessNav>
            <ArrowIconLink to="/" pointTo="left">
              取消
            </ArrowIconLink>
            <NextStepButton action="註冊" />
          </ProcessNav>
        </FormItemWrapper>
      </ComfyForm>
    );
  }
}

export default withRouter(SignUpForm);
