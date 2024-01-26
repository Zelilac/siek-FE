import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message'
import HTTP from '../../service/HTTP';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

class DialogAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            username: '',
            email: '',
            gender: '',
            age: '',
            role: 'seller',
            loading: false
        };
        this.role = [
            { name: 'Seller', code: 'seller' },
        ];
        this.gender = [
            { name: 'Male', code: 'Male' },
            { name: 'Female', code: 'Female' },
        ];

    }

    printWarning = (trigger) => {
        if (trigger) {
            return <small className="p-error">Required.</small>
        } else {
            return null
        }
    }

    saveChanges = async () => {
        try {
            let { fullname, username, gender, age, email, role } = this.state
            let checkField = [fullname, username, gender, age, email, role]
            if (checkField.indexOf("") > -1) {
                this.setState({ error: true })
                setTimeout(() => {
                    this.setState({ error: false })
                }, 3000)
            } else {
                // fumgsi edit ke API
                try {
                    this.setState({ loading: true })
                    let edit = await HTTP.post('/user/post-user', {
                        fullname, username, gender, age, email, role,
                    })
                    this.setState({ loading: false, addDialog: false })
                    this.props.toast("success", "Success!", edit.data.messages)
                    this.props.getUser()
                    this.props.hide()
                } catch (error) {
                    this.setState({ loading: false })
                    let errMessage = error.response.data && error.response.data.messages ? error.response.data.messages : "something bad happen!"
                    this.props.toast("error", "Error!", errMessage)
                }
            }

        } catch (error) {
            console.log("error edit", error)
        }
    }

    onBtnCancel = () => {
        this.props.hide()
    }

    render() {
        let { addDialog, hide } = this.props

        const addDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={this.onBtnCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-success p-button-text" onClick={this.saveChanges} loading={this.state.loading} />
            </React.Fragment>
        );
        return (
            <Dialog visible={addDialog} style={{ width: '450px' }} header="Add New User" modal className="p-fluid " onHide={hide} footer={addDialogFooter}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="w-100">
                        <label style={{ fontWeight: 'bold' }}>Fullname</label>
                        <InputText value={this.state.fullname} onChange={(e) => this.setState({ fullname: e.target.value })} style={{ border: this.state.fullname === "" ? '1px solid red' : null }} />
                        {this.state.fullname === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Username</label>
                        <InputText value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} style={{ border: this.state.username === "" ? '1px solid red' : null }} />
                        {this.state.username === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Gender</label>
                        <Dropdown value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} options={this.gender} optionLabel="name" optionValue="code"
                            className="w-full md:w-14rem" style={{ border: this.state.gender === "" ? '1px solid red' : null }} />
                        {this.state.gender === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Age</label>
                        <InputNumber max={100} min={0} value={this.state.age} onChange={(e) => this.setState({ age: e.value })}
                            style={{ border: this.state.age === "" ? '1px solid red' : null }}
                        />
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Email</label>
                        <InputText value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })}
                            style={{
                                border: this.state.email
                                    ? this.state.email.match(/(\.com|\.co|\.id)/gi) &&
                                        this.state.email.includes("@")
                                        ? "1px solid black"
                                        : "1px solid red"
                                    : "1px solid red",
                            }}
                        />
                        {this.state.email ? (
                            this.state.email.match(/(\.com|\.co|\.id)/gi) &&
                                this.state.email.includes("@") ? (
                                <small style={{ fontSize: "10px", color: "green" }}>
                                    Email valid!
                                </small>
                            ) : (
                                <small className="p-error">
                                    Email invalid
                                </small>
                            )
                        ) : (
                            <small className="p-error">
                                Required.
                            </small>
                        )}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Role</label>
                        <Dropdown disabled value={this.state.role} options={this.role} optionLabel="name" optionValue="code"
                            placeholder="User Role" className="w-full md:w-14rem" />
                    </div>
                    {this.state.error && <Message severity="error" text="Fill all the form!" />}
                </div>
            </Dialog>
        );
    }
}
export default DialogAdd;