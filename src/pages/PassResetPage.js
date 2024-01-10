import React from 'react';
import dataArrange from '../assets/illustration/dataArranging.svg'
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import axios from 'axios';
import { URL_API } from '../Helper';
import { Toast } from 'primereact/toast';
import { Redirect } from 'react-router-dom';

class PassResetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confPassword: '',
            warning: false,
            loading: false,
            redirect: false
        }
    }

    onBtnSave = async () => {
        try {
            let { password, confPassword } = this.state
            if(password && confPassword){
                if (password.match(/^(?=.*[a-z].*)(?=.*[0-9].*)[a-z0-9]{6,}$/ig)) {
                    if (password === confPassword) {
                        this.setState({loading: true})
                        const headers = {
                            headers: {
                                'Authorization': `Bearer ${this.props.location.pathname.split('/')[2]}`
                            }
                        }
                        
                        let reset = await axios.post(URL_API + `/user/reset-pass`, { password }, headers)
                        this.setState({loading: false, redirect: true})
                        alert(reset.data.messages)
                    }
    
                } else {
                    this.toast.show({severity: 'warn', summary: 'Invalid', detail: 'Invalid password format!', sticky: true})
                    this.setState({warning: true})
                }
            } else {
                this.toast.show({severity: 'warn', summary: 'Warning', detail: 'Please fill the form to reset your password', sticky: true})
            }
        } catch (error) {

        }
    }
    render() {
        let { password, confPassword, warning, loading, redirect } = this.state
        if(redirect){
            return <Redirect to="/login" />
        }
        return (
            <div className="d-flex flex-column justify-centert-center align-items-center container-fluid" style={{ backgroundColor: '#3164d2', height: '100vh', backgroundImage: 'linear-gradient(to top, #5a83db , #3164d2)', position: 'relative', overflow: 'hidden' }}>
                <img src={dataArrange} style={{ width: '100%', height: '120%', position: 'absolute', bottom: '-5%', right: '3%' }} />
                <div className="d-flex flex-column border p-5" style={{ height: 'auto', borderRadius: '30px', backgroundColor: 'whitesmoke', position: 'absolute', top: '15%', margin: '0 5%' }}>
                    <Toast ref={(el) => this.toast = el} />
                    <h4>Password Reset</h4>
                    <p>Enter your new password to reset your password. <br/><span style={{fontSize: '12px',color: warning ? 'red' : 'black'}}>Make sure your password consist of 6 characters including <br/> numbers and alphabet</span></p>
                    
                    <h6>New Password</h6>
                    <Password value={password} onChange={(e) => this.setState({ password: e.target.value })} feedback={false} toggleMask inputStyle={{ width: '100%', backgroundColor: '#dce4e4', border: 'none' }} />
                    <h6 className="mt-2">Confirm Password</h6>
                    <Password value={confPassword} onChange={(e) => this.setState({ confPassword: e.target.value })} feedback={false} toggleMask inputStyle={{ width: '100%', backgroundColor: '#dce4e4', border: 'none' }} />
                    {
                        password ? (password === confPassword ? <small style={{ color: 'green', fontSize: '10px' }}>Password match</small> : <small style={{ color: 'red', fontSize: '10px' }}>Password not match</small>) : null
                    }
                    <Button label="Save" className="p-button-raised p-button-warning mt-3" style={{ width: '30%', margin: '0 auto' }} onClick={this.onBtnSave} loading={loading}/>
                </div>
            </div>
        );
    }
}

export default PassResetPage;