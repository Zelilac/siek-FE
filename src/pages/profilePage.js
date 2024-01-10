import React from "react";
import {
  Container,
  Row,
  Col,
} from "reactstrap";

import {
  faUser,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/css/profilePage.css";
import Profile from "../assets/images/profile.png";
import ProfileComp from "../components/user/profileComp";
import TransactionPage from "./TransactionPage";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      file: Profile,
      isOpen: false,
      indexActive: this.checkIndexActive(),
      index: 1,
      iduser: 4,
    };
  }

  componentDidMount() {
    let list = document.querySelectorAll(`.list`);
    for (let i = 0; i < list.length; i++) {
      list[i].onclick = function () {
        let j = 0;
        while (j < list.length) {
          list[j++].className = "list";
        }
        list[i].className = "list active";
      };
    }
  }

  checkIndexActive = () =>{
    if(this.props.location.state){
       this.setState({indexActive:this.props.location.state.indexActive})
    }else{
       this.setState({indexActive:1})
    }
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  render() {
    console.log('state props',this.props.location.state)
    console.log('index active',this.state.indexActive)
    return (
      <Container className="mt-5">
        <Row>
          {/* Sidebar */}
          <Col md="2">
            <Container fluid>
              <Row>
                <Col md="12 p-0">
                  <div className="navigation">
                    <ul>
                      <li
                        class="list active"
                        onClick={() => {
                          this.setState({
                            index: 1,
                          });
                        }}
                      >
                        <b></b>
                        <b></b>
                        <a href="#">
                          <span className="icon">
                            <FontAwesomeIcon icon={faUser} />
                          </span>
                          <span className="title">Profile</span>
                        </a>
                      </li>
                      <li class="list">
                        <b></b>
                        <b></b>
                        <a
                          href="#"
                          onClick={() => {
                            this.setState({
                              index: 3,
                            });
                          }}
                        >
                          <span className="icon">
                            <FontAwesomeIcon icon={faHistory} />
                          </span>
                          <span className="title">Transaction</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>

          {/* NAVIGATION */}

          {this.props.location.state ? 
          (<>{this.props.location.state.indexActive === 3 ?(<><TransactionPage /></>):
            this.props.location.state.indexActive === 1 ?(<><ProfileComp /></>):(<></>)}</>):
          (<>{this.state.index === 1 ? (
            <>
              <ProfileComp />
            </>
          ) : this.state.index === 2 ? (
            <></>
          ) : this.state.index === 3 &&(
            <>
              <TransactionPage />
            </>
          )}</>)}
        </Row>
      </Container>
    );
  }
}

export default ProfilePage;
