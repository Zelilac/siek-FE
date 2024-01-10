import React from 'react';
import HTTP from '../../service/HTTP';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class ListUsersPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalRevenue: 0,
            totalUserTrans: 0,
            usersList: [],
            registeredUser: 0
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

    dateFormat = (value) => {
        return value.toLocaleDateString()
    }

    printCreatedDate = (rowData) => {
        return <span>{new Date(rowData.created_at).toLocaleDateString('id')}</span>
    }

    printLastUpdate = (rowData) => {
        return <span>{new Date(rowData.updated_at).toLocaleDateString('id')}</span>
    }
    render() {
        let { totalRevenue, totalUserTrans, usersList, registeredUser } = this.state
        return (
            <div class="main-content">
                <main>
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
                                <h3>List of Users</h3>
                                <DataTable value={usersList} paginator rows={5} emptyMessage="No customers found" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[5, 10, 25, 50]}>
                                    <Column field="fullname" header="Name" sortable />
                                    <Column field="email" header="Email" style={{ width: '30%' }} sortable />
                                    <Column field="status" header="User Status" sortable />
                                    <Column field="created_at" body={this.printCreatedDate} header="Join Date" sortable />
                                    <Column field="updated_at" body={this.printLastUpdate} header="Last Update" sortable />
                                </DataTable>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }
}

export default ListUsersPage;