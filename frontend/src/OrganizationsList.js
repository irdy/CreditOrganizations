import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import ReactPaginate from 'react-paginate';

const SERVER_URL = 'http://localhost:3002';
class OrganizationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            pageCount: 1
            // filters
        }
    }

    static addSearchParams(url, params) {
        let _url = new URL(url);
        _url.search = new URLSearchParams(params);
        return _url;
    }

    createParamsCollection() {
        let collection = Object.create(null);
        collection.page = this.state.page;
        return collection;
    }

    loadData() {
        let URL = SERVER_URL + '/creditOrganizations';
        URL = OrganizationsList.addSearchParams(URL, this.createParamsCollection());
        console.log(URL);
        fetch(URL, {
            /*"Access-Control-Allow-Origin": "*",*/
            "ContentType": "application/json; charset=utf-8"
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    console.dir(data.data[0]);
                    let { page, pageCount } = data;
                    if (Array.isArray(data.data) && Number.isInteger(page) && Number.isInteger(pageCount)) {
                        this.setState({
                            data: data.data,
                            page,
                            pageCount
                        })
                    } else {
                        console.error('received incorrect data')
                    }
                }
            })
            .catch(err => {throw new Error(err)})
    }

    componentDidMount() {
        this.loadData();
    }

    handlePageClick(data) {
        let currentPage = data.selected + 1;
        this.setState({
            page: currentPage
        }, this.loadData);
    }

    render() {
        return (
            <div>
                <h2>OrganizationsList</h2>
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>БИК</th>
                        <th>Название</th>
                        <th>Адрес</th>
                        <th>Корсчет</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>{ el.BIC }</td>
                                        <td>{ el.name }</td>
                                        <td>{ el.Tnp + ' ' + el.Nnp + ' ' + el.Adr }</td>
                                        <td>{ el.account }</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                <div className="pagination-area">
                    <div>Page: {this.state.page}</div>
                    <div>Total pages: {this.state.pageCount}</div>
                    <div id="react-paginate" className="d-flex justify-content-center">
                        <ReactPaginate
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick.bind(this)}
                        >
                        </ReactPaginate>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrganizationsList;