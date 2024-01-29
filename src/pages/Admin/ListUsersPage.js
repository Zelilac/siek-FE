import React from 'react';
import HTTP from '../../service/HTTP';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import DialogEdit from "../../components/user/DialogEdit";
import { Toast } from "primereact/toast";
import { connect } from "react-redux";
import { Toolbar } from "primereact/toolbar";
import DialogAdd from '../../components/user/DialogAdd';

class ListUsersPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalRevenue: 0,
            totalUserTrans: 0,
            usersList: [],
            registeredUser: 0,
            userDetail: {},
            userDialog: false,
            addDialog: false,
            schoolsData: []
        }
    }

    async componentDidMount() {
        await this.getRevenue()
        await this.getUser()
        await this.getRevenue()

    }
    getRevenue = async () => {
        try {
            let res = await HTTP.get('/transaction/revenue')
            this.setState({ totalRevenue: res.data[0].total_revenue, totalUserTrans: res.data[0].total_user })
        } catch (error) {
            console.log("error get revenue", error)
        }
    }

    getUser = async () => {
        try {
            let user = await HTTP.get('/user/get')
            let registeredUser = user.data.length
            this.setState({ usersList: user.data, registeredUser })
        } catch (error) {
            console.log("getuser", error)
        }
    }

    
    getSchools = async () => {
        try {
            await HTTP.get(`/user/get-schools`).then((res) => {
                console.log(res.data, "res.data")
                this.setState({
                    schoolsData: res.data,
                });
            })
        } catch (error) {
            console.log(error)
        }
    };

    dateFormat = (value) => {
        return value.toLocaleDateString()
    }

    printCreatedDate = (rowData) => {
        return <span>{new Date(rowData.created_at).toLocaleDateString('id')}</span>
    }

    printLastUpdate = (rowData) => {
        return <span>{new Date(rowData.updated_at).toLocaleDateString('id')}</span>
    }

    editUser = async (user) => {
        try {
            this.setState({
                userDetail: user,
                userDialog: true,
                addDialog: false,
                confirmDialog: false,
                idstock: null,
            });

        } catch (error) {
            console.log(error);
        }
    };

    inputChange = (e, property) => {
        let val = e.target.value;
        let userDetail = { ...this.state.userDetail };
        userDetail[`${property}`] = val;
        this.setState({ userDetail });
    };

    actionBodyTemplate = (rowData) => {
        return rowData?.role !== "admin" && (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2"
                    onClick={() => this.editUser(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning ml-1"
                    onClick={() => {
                        console.log(this.props, "asdasdasd")
                        // this.setState({ confirmDialog: true, idstock: rowData.stock[0].id })
                    }
                    }
                />
                <ConfirmDialog
                    visible={this.state.confirmDialog}
                    onHide={() => this.setState({ confirmDialog: false })}
                    message="Are you sure you want to proceed?"
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    accept={() => this.confirmDeleteProduct(rowData.stock[0].id)}
                    reject={() =>
                        this.toast.show({
                            severity: "info",
                            summary: "Rejected",
                            detail: "Cancel delete product",
                            life: 3000,
                        })
                    }
                />
            </React.Fragment>
        );
    };

    //TOOL BAR
    leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <h4>List of Users</h4>
            </React.Fragment>
        );
    };

    rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="New Seller"
                    icon="pi pi-plus"
                    className="p-button-success mx-3"
                    onClick={() => {
                        this.getSchools()
                        this.setState({ addDialog: true })
                    }}
                />
            </React.Fragment>
        );
    };

    render() {
        let { totalRevenue, totalUserTrans, usersList, registeredUser, userDetail, userDialog, addDialog } = this.state
        return (
            <div class="main-content">
                <main>
                    <Toast ref={(el) => (this.toast = el)} />
                    <div className="my-3">
                        <h2 class="dash-title">Pharmaclick Dashboard</h2>
                        <span>Hello! You logged in as admin</span>
                    </div>
                    <div class="dash-cards">
                        <div class="card-single">
                            <div class="card-body">
                                <span class="ti-reload"></span>
                                <div>
                                    <h5>Total Registered User</h5>
                                    <h4>{registeredUser}</h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="">View all</a>
                            </div>
                        </div>

                        <div class="card-single">
                            <div class="card-body">
                                <span class="ti-check-box"></span>
                                <div>
                                    <h5>Total User did Transactions</h5>
                                    <h4>{totalUserTrans}</h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="">View all</a>
                            </div>
                        </div>
                    </div>

                    <section class="recent">
                        <div class="list-user-grid">
                            <div class="activity-card">
                                <Toolbar
                                    className="p-mb-4 mb-3"
                                    left={this.leftToolbarTemplate}
                                    right={this.rightToolbarTemplate}
                                ></Toolbar>
                                <DataTable value={usersList} paginator rows={5} emptyMessage="No customers found" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[5, 10, 25, 50]}>
                                    <Column field="fullname" header="Name" sortable />
                                    <Column field="email" header="Email" style={{ width: '30%' }} sortable />
                                    <Column field="status" header="User Status" sortable />
                                    <Column field="created_at" body={this.printCreatedDate} header="Join Date" sortable />
                                    <Column field="updated_at" body={this.printLastUpdate} header="Last Update" sortable />
                                    <Column field="school_name" header="School" sortable />
                                    {this.props.role === "admin" && <Column field="action" body={this.actionBodyTemplate} header="Action" />}
                                </DataTable>
                            </div>
                        </div>
                    </section>
                    <DialogEdit
                        userDetail={userDetail}
                        userDialog={userDialog}
                        hide={() => this.setState({ userDialog: false })}
                        inputChange={(e, property) => {
                            this.inputChange(e, property);
                        }}
                        toast={(a) =>
                            this.toast.show({
                                severity: "success",
                                summary: "Success!",
                                detail: a,
                                life: 3000,
                            })
                        }
                        getUser={() => this.getUser()}
                    />
                    <DialogAdd
                        addDialog={addDialog}
                        hide={() => this.setState({ addDialog: false })}
                        inputChange={(e, property) => {
                            this.inputChange(e, property);
                        }}
                        toast={(type, summary, detail) =>
                            this.toast.show({
                                severity: type,
                                summary: summary,
                                detail: detail,
                                life: 3000,
                            })
                        }
                        schoolsData={this.state.schoolsData}
                        getUser={() => this.getUser()}
                    />
                </main>
            </div>
        );
    }
}

const mapStateToProps = ({ authReducer }) => {
    return {
        ...authReducer
    }
}
export default connect(mapStateToProps)(ListUsersPage);