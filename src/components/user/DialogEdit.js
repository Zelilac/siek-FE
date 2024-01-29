import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message'
import HTTP from '../../service/HTTP';
import { Dropdown } from 'primereact/dropdown';

class DialogEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            username: '',
            email: false,
            role: '',
            loading: false
        };
        this.role = [
            { name: 'User', code: 'user' },
            { name: 'Seller', code: 'seller' },
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
            let { role, iduser } = this.props.userDetail
            let checkField = [role]
            if (checkField.indexOf("") > -1) {
                this.setState({ error: true })
                setTimeout(() => {
                    this.setState({ error: false })
                }, 3000)
            } else {
                // fumgsi edit ke API
                this.setState({loading: true})
                let edit = await HTTP.patch('/user/patch-role-user', {
                    role,
                    iduser
                })
                this.setState({loading: false, userDialog: false})
                this.props.toast(edit.data.messages)
                this.props.getUser()
                this.props.hide()
            }

        } catch (error) {
            console.log("error edit", error)
        }
    }

    onBtnCancel = () =>{
        this.props.hide()
    }

    render() {
        let { userDetail, userDialog, hide, inputChange } = this.props
        
        const userDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={this.onBtnCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-success p-button-text" onClick={this.saveChanges} loading={this.state.loading} />
            </React.Fragment>
        );
        return (
            <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid " onHide={hide} footer={userDialogFooter}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="w-100">
                        <label style={{ fontWeight: 'bold' }}>Fullname</label>
                        <InputText disabled value={userDetail.fullname} onChange={(e) => inputChange(e, 'fullname')} style={{ border: userDetail.fullname === "" ? '1px solid red' : null }} />
                        {userDetail.fullname === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Username</label>
                        <InputText disabled value={userDetail.username} onChange={(e) => inputChange(e, 'username')} style={{ border: userDetail.username === "" ? '1px solid red' : null }} />
                        {userDetail.username === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Email</label>
                        <InputText disabled value={userDetail.email} onChange={(e) => inputChange(e, 'email')} style={{ border: userDetail.email === "" ? '1px solid red' : null }} />
                        {userDetail.email === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Role</label>
                        <Dropdown value={userDetail.role} onChange={(e) => inputChange(e, 'role')} options={this.role} optionLabel="name" optionValue="code"
                            placeholder="User Role" className="w-full md:w-14rem" />
                    </div>
                    {this.state.error && <Message severity="error" text="Fill all the form!" />}
                </div>
            </Dialog>
        );
    }
}
export default DialogEdit;