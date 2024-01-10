import React from 'react';
import task from '../assets/illustration/task.svg'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { URL_API } from '../Helper';
import { Messages } from 'primereact/messages';

class VerificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: ''
        }
    }

    onBtnVerify = async () => {
        try {
            let { otp } = this.state
            const headers = {
                headers: {
                    'Authorization': `Bearer ${this.props.location.pathname.split('/')[2]}`
                }
            }

            let verification = await axios.post(URL_API + `/user/verif`, { otp }, headers)
            if(verification.data){
                this.msgs.show({severity: 'success', summary: 'Success:', detail: verification.data.messages, sticky: true})
            }
        } catch (error) {
            console.log("verify", error)
        }
    }
    render() {
        return (
            <div className="container-fluid" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                <div className="d-flex align-items-center justify-content-center border" style={{ height: '100%' }}>
                    <img src={task} style={{ width: '45%' }} alt='task'/>
                    <div className="p-4 m-3 ml-5" style={{ width: 'auto', backgroundColor: '#3662d3', bottom: '37%', color: 'white', borderRadius: '30px' }}>
                        <h4>Verify Your Account</h4>
                        <p>To verify your account please input OTP from your verification email.</p>
                        <div className="d-flex mt-5"  >
                            <div style={{ width: '70%' }}>
                                <span className="p-float-label">
                                    <InputText id="inputtext" value={this.state.otp} onChange={(e) => this.setState({ otp: e.target.value })} style={{ width: '100%' }} />
                                    <label style={{ color: '#ffa942' }}>OTP</label>
                                </span>
                            </div>
                            <div className="mx-2">
                                <Button label="Verify" className="p-button-warning" onClick={this.onBtnVerify}/>
                            </div>
                        </div>
                            <Messages ref={(el) => this.msgs = el} />
                    </div>
                </div>
            </div>
        );
    }
}

export default VerificationPage;