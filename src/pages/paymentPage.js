import React from 'react';
import {Container,Row,Col,Collapse} from "reactstrap"
import {
    faAngleDown
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/css/PaymentPage.css"
import {Link} from "react-router-dom"

class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { collapse:false,collapse1:false,collapse2:false,collapse3:false }
    }
    render() { 
        return ( 
        <Container className="mt-5">
            <Row className="mt-5">
                <center>
                <Col md="2 mt-5"><h6>Complete your payment</h6></Col>
                <Col md="2 mt-3" style={{border:`3px solid #76B3B4`}}>
                    <center>
                    <h3>Rp {this.props.location.state.total_price}</h3>
                    </center>
                </Col>
                </center>
                    <center>
                <Col md="5 mt-5 p-3" style={{border:`1px solid #ccc`,borderRadius:"15px"}}>
                    {/* <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/> */}
                    <div className="d-flex justify-content-between align-items-center">
                    <img src="https://infobanknews.com/wp-content/uploads/2018/05/logo-BNI-46-1.png" width="20%" alt='bank-logo'/>
                    <h6>BNI Virtual Account</h6>
                    </div>
                    <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/>
                    <div className="d-flex justify-content-between align-items-center">
                    {this.props.location.state.phone_number !== "" ? (<><h6>827{this.props.location.state.phone_number}</h6></>):(<><h6>827938216555</h6></>)}
                    <h6>Virtual Account Number</h6>
                    </div>
                </Col>
                <div className="btn-getstarted mt-4">
                <Link to ={{
                    pathname: "/profile", 
                    state: { 
                    indexActive:3
                    }
                }} style={{ textDecoration: "none" }}>
                            <a>Go To Transaction</a>
                </Link>
                </div>
                    </center>
                    <center>
                <Col md="5">
                    <div style={{textAlign:"left"}}>
                    <h5 className="mt-5">Payment Guide</h5>
                    <div className="d-flex justify-content-between mt-3">
                    <a  onClick={()=>{this.setState({collapse:!this.state.collapse})}} style={{cursor:"pointer"}}>ATM BNI</a>
                    <a onClick={()=>{this.setState({collapse:!this.state.collapse})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                    </div>
                    <Collapse
                    isOpen={this.state.collapse}
                    // onEntering={onEntering}
                    // onEntered={onEntered}
                    // onExiting={onExiting}
                    // onExited={onExited}
                    >
                    <p style={{color:"#A6A6A6"}}> 1. Insert your Card.<br/>
                        2. Select a language.<br/>
                        3. Enter your ATM PIN.<br/>
                        4. Select "More Menu".<br/>
                        5. Select "Transfers".<br/>
                        6. Select the type of account you will use (Example: "From a Savings Account").<br/>
                        7. Select "Virtual Account Billing".<br/>
                        8. Enter your Virtual Account number.<br/>
                        9. The bill to be paid will appear on the confirmation screen.<br/>
                        10. Confirm, if it is appropriate, continue the transaction.<br/>
                        11. The transaction has been completed.</p>
                        </Collapse>
                        </div>

                        <div>
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse1:!this.state.collapse1})}} style={{cursor:"pointer"}}>Mobile Banking BNI</a>
                        <a onClick={()=>{this.setState({collapse1:!this.state.collapse1})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse1}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Access BNI Mobile Banking from your cellphone then enter your user ID and password.<br/>
                        2. Select the "Transfer" menu.<br/>
                        3. Select the "Virtual Account Billing" menu then select a debit account.<br/>
                        4. Enter your Virtual Account number in the "new input" menu.<br/>
                        5. The bill to be paid will appear on the confirmation screen.<br/>
                        6. Confirm the transaction and enter the Transaction Password.<br/>
                        7. Your Payment Has Been Successful</p>
                        </Collapse>
                        </div>

                        <div>
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse2:!this.state.collapse2})}} style={{cursor:"pointer"}}>SMS Banking BNI</a>
                        <a onClick={()=>{this.setState({collapse2:!this.state.collapse2})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse2}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Open the BNI SMS Banking application<br/>
                        2. Select the Transfer menu<br/>
                        3. Select the BNI account Trf menu<br/>
                        4. Enter the destination account number with a 16-digit Virtual Account Number.<br/>
                        5. Enter the transfer amount according to your bill or obligation. Different denominations cannot be processed.<br/>
                        6. Select "Process" then "Agree"<br/>
                        7. Reply sms by typing the pin according to the command<br/>
                        8. Transaction Successful</p>
                        </Collapse>
                        </div>

                        <div className="mb-5">
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse3:!this.state.collapse3})}} style={{cursor:"pointer"}}>Transfer from other bank</a>
                        <a onClick={()=>{this.setState({collapse3:!this.state.collapse3})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse3}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Select the "Interbank transfer" or "Interbank online transfer" menu.<br/>
                        2. Enter the BNI bank code (009) or select the destination bank, namely BNI.<br/>
                        3. Enter the 16 Digit Virtual Account Number in the destination account field.<br/>
                        4. Enter the transfer amount according to your bill or obligation. Different denominations cannot be processed.<br/>
                        5. Enter the payment amount: .
                        6. Confirmation of your details will appear on the screen, check and if it is appropriate please continue the transaction until it is complete.<br/>
                        7. Transaction Successful.</p>
                        </Collapse>
                        </div>
                </Col>
                </center>
            </Row>
        </Container> );
    }
}
 
export default PaymentPage;