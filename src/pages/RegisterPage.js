import React from "react";
import doctorWoman from "../assets/illustration/doctor-woman.svg";
import doctorMan from "../assets/illustration/doctor-man.svg";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { URL_API } from "../Helper.js";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Messages } from "primereact/messages";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.showSticky = this.showSticky.bind(this);
    this.state = {
      password: "",
      username: "",
      email: "",
      nama: "",
      loading: false,
      invalid: [],
      confPassword: ""
    };
  }

  showSticky = (messages, severity) => {
    this.toast.show({
      severity: severity,
      summary: "Register Succes",
      detail: messages,
    });
  };
  onBtnSignup = async () => {
    try {
      let { nama, username, email, password } = this.state;
      if (nama === "" || username === "" || email === "" || password === "") {
        this.toast2.show({
          severity: "error",
          summary: "Error: .",
          detail: `Fill all the form!`,
          sticky: true,
        });
        return null;
      } else {
        if (username.length >= 6) {
          if (email.match(/(\.com|\.co|\.id)/gi) && email.includes("@")) {
            if (password.match(/^(?=.*[a-z].*)(?=.*[0-9].*)[a-z0-9]{6,}$/gi)) {
              this.setState({ loading: true });
              // cek apakah email sudah terdaftar
              let getEmail = await axios.get(
                URL_API + `/user/get?email=${email}`
              );
              if (getEmail.data.length === 0) {
                let register = await axios.post(URL_API + "/user/register", {
                  nama,
                  username,
                  email,
                  password,
                });
                this.showSticky(register.data.messages, "success");
                this.toast2.show({
                  severity: "success",
                  summary: "Register ",
                  detail: " Register success",
                  sticky: true,
                });
              } else {
                this.toast2.show({
                  severity: "warn",
                  summary: "Warning ",
                  detail: " Email already registerd!",
                  sticky: true,
                });
              }
              this.setState({ loading: false });
            } else {
              this.toast2.show({
                severity: "warn",
                summary: "Invalid: ",
                detail: " Invalid format password!",
                sticky: true,
              });
            }
          } else {
            this.toast2.show({
              severity: "warn",
              summary: "Invalid: ",
              detail: " Invalid format email!",
              sticky: true,
            });
          }
        } else {
          this.toast2.show({
            severity: "warn",
            summary: "Invalid: ",
            detail: " Username minimum 6 chars!",
            sticky: true,
          });
        }
      }
    } catch (error) {
      console.log("Error registration", error);
    }
  };
  render() {
    const regex = new RegExp(
      /^(?=.*[a-z].*)(?=.*[0-9].*)[a-z0-9]{6,}$/,
      "i",
      "g"
    );
    let { nama, username, email, password, confPassword } = this.state;
    return (
      <div
        className="container-fluid mt-5"
        style={{
          height: "90vh",
          width: "100%",
          backgroundImage: "linear-gradient(to bottom, white , #f0edfe)",
          overflow: "hidden",
        }}
      >
        <Toast ref={(el) => (this.toast = el)} />
        <Toast ref={(el) => (this.toast2 = el)} />
        <div
          className="row"
          style={{
            width: "92%",
            height: "75vh",
            borderRadius: "30px",
            backgroundColor: "white",
            boxShadow: "5px 5px 7px grey",
            margin: "auto",
            marginTop: "50px",
          }}
        >
          <div
            className="col-6 d-none d-md-flex justify-content-center align-items-center"
            style={{
              padding: "0 60px",
              height: "100%",
              borderRadius: "30px",
              backgroundColor: "#3264d6",
            }}
          >
            <img src={doctorWoman} style={{ height: "80%" }} />
            <img src={doctorMan} style={{ height: "80%" }} />
          </div>
          <div
            className="col-6 d-flex flex-column justify-content-center w-xs-100 w-sm-100 w-md-50"
            style={{ padding: "0 60px", height: "100%" }}
          >
            <div>
              <h2 style={{ fontFamily: "Comfortaa, cursive" }}>Get started</h2>
              <span style={{ fontSize: "12px", color: "grey" }}>
                Already have an account?
                <Link
                  to="/login"
                  style={{
                    color: "#2399f9",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  Log in
                </Link>
              </span>
            </div>
            <div>
              <div className="p-fluid row">
                <Messages ref={(el) => (this.msgs2 = el)} />
                <div>
                  <label className="p-d-block">Name</label>
                  <InputText
                    value={nama}
                    onChange={(e) => this.setState({ nama: e.target.value })}
                    className="p-inputtext-sm"
                  />
                  <small
                    id="username1-help"
                    className={this.state.invalid[0]}
                    style={{ fontSize: "10px" }}
                  >
                    Enter your full name{" "}
                  </small>
                </div>
              </div>
              <div className="p-fluid row">
                <div className="p-field d-flex flex-column col-6 col-md-6">
                  <label className="p-d-block">Username</label>
                  <InputText
                    className="p-d-block  p-inputtext-sm"
                    value={username}
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
                    style={{
                      border: username
                        ? username.length >= 6
                          ? "1px solid black"
                          : "1px solid red"
                        : "1px solid black",
                    }}
                  />
                  {username ? (
                    username.length >= 6 ? (
                      <small style={{ fontSize: "10px", color: "green" }}>
                        Username valid!
                      </small>
                    ) : (
                      <small style={{ color: "red", fontSize: "10px" }}>
                        Invalid username. Minumum 6 chars
                      </small>
                    )
                  ) : (
                    <small style={{ fontSize: "10px" }}>
                      Enter your username.
                    </small>
                  )}
                </div>
                <div className="p-field d-flex flex-column col-6 col-md-6">
                  <label className="p-d-block">Email</label>
                  <InputText
                    className="p-d-block  p-inputtext-sm"
                    value={this.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    style={{
                      border: email
                        ? email.match(/(\.com|\.co|\.id)/gi) &&
                          email.includes("@")
                          ? "1px solid black"
                          : "1px solid red"
                        : "1px solid black",
                    }}
                  />
                  {email ? (
                    email.match(/(\.com|\.co|\.id)/gi) &&
                      email.includes("@") ? (
                      <small style={{ fontSize: "10px", color: "green" }}>
                        Email valid!
                      </small>
                    ) : (
                      <small style={{ fontSize: "10px", color: "red" }}>
                        Email invalid
                      </small>
                    )
                  ) : (
                    <small style={{ fontSize: "10px" }}>
                      Enter your email.
                    </small>
                  )}
                </div>
              </div>
              <div className="p-fluid row">
                <div className="col-sm-12 col-md-6">
                  <label className="p-d-block">Password</label>
                  <Password
                    value={password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    feedback={false}
                    toggleMask
                    className="p-password-meter-info-sm"
                    inputStyle={{
                      border: password
                        ? password.match(regex)
                          ? "1px solid black"
                          : "1px solid red"
                        : "1px solid black",
                    }}
                  />
                  {password ? (
                    password.match(regex) ? (
                      <small style={{ fontSize: "10px", color: "green" }}>
                        Password valid!
                      </small>
                    ) : (
                      <small style={{ fontSize: "10px", color: "red" }}>
                        Password invalid. At least 6 characters contatin 1
                        alphabet and 1 number
                      </small>
                    )
                  ) : (
                    <small style={{ fontSize: "10px" }}>
                      Enter your password.
                    </small>
                  )}
                </div>
                <div className="col-sm-12 col-md-6">
                  <label className="p-d-block">Confirmation Password</label>
                  <Password
                    value={confPassword}
                    onChange={(e) =>
                      this.setState({ confPassword: e.target.value })
                    }
                    feedback={false}
                    toggleMask
                    className="p-password-meter-info-sm"
                    inputStyle={{
                      border: confPassword 
                        ? password === confPassword 
                          ? "1px solid black"
                          : "1px solid red"
                        : "1px solid black",
                    }}
                  />
                  {confPassword ? (
                    password === confPassword ? (
                      <small style={{ fontSize: "10px", color: "green" }}>
                        Password match
                      </small>
                    ) : (
                      <small style={{ fontSize: "10px", color: "red" }}>
                        Password not match
                      </small>
                    )
                  ) : (
                    <small style={{ fontSize: "10px" }}>
                      Confirm your password.
                    </small>
                  )}
                </div>
              </div>
              <Button
                label="Sign Up"
                className="p-button-warning my-2"
                onClick={this.onBtnSignup}
                loading={this.state.loading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterPage;
