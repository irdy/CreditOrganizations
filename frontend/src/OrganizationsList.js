import React from 'react';
import { Table } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import Heading from './Heading';
import { Button } from 'reactstrap';
import OrganizationsFilters from './OrganizationsFilters';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import InfoModal from './InfoModal';

const SERVER_URL = 'http://localhost:3002';
class OrganizationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            pageCount: 1,
            selected: 0,
            filters: {
                bic: '',
                name: ''
            },
            modalOpened: false,
            modalMessage: '',
            modalControls: {
                ok: true,
                cancel: false
            }
        };
        this.perPage = 50;
        this.heading = 'Список организаций';
    }

    static addSearchParams(url, params) {
        let _url = new URL(url);
        _url.search = new URLSearchParams(params);
        return _url;
    }

    populateCollectionWithFilters(collection) {
        let { filters } = this.state;
        for (let filter in filters) {
            if (typeof filters[filter] === 'string' && filters[filter] !== '') {
                collection[filter] = filters[filter];
            }
        }
        return collection;
    }

    createParamsCollection() {
        let collection = Object.create(null);
        collection.page = this.state.page;
        this.populateCollectionWithFilters(collection);
        return collection;
    }

    loadData() {
        let URL = SERVER_URL + '/creditOrganizations';
        URL = OrganizationsList.addSearchParams(URL, this.createParamsCollection());
        fetch(URL, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    //console.dir(data.data[0]);
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
            selected: data.selected,
            page: currentPage
        }, this.loadData);
    }

    filter(filters) {
        let notEmpty = Object.values(filters).filter(filter => typeof filter === 'string' && filter !== '');
        if (notEmpty) {
            this.setState({
                ...this.state,
                ...{
                    filters: {
                        ...this.state.filters,
                        ...filters
                    }
                }
            }, () => {
                this.loadData();
            })
        }
    }

    static renderNoResults() {
        return (
            <Alert color="info">
                Результатов не найдено
            </Alert>
        )
    }

    openModal(message) {
        this.setState({
            modalOpened: true,
            modalMessage: message
        })
    }

    remove(bic) {
        let URL = SERVER_URL + '/creditOrganizations/' + bic;
        fetch(URL, {
            method: 'DELETE'
        })
            .then(res => res.text())
            .then(message => {
                this.openModal(message);
                this.loadData();
                this.setState({
                    modalOpened: false
                })
            })
            .catch(err => console.error(err));

    }

    removeClickHandler(bic) {
        let message = "Вы действительно хотите удалить эту запись?";
        if (window.confirm(message)) {
            this.remove(bic);
        }
    }

    render() {
        return (
            <div className="container">
                <InfoModal
                    modalOpened={this.state.modalOpened}
                    message={this.state.modalMessage}
                    modalControls={this.state.modalControls}
                />
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Heading text={this.heading} />
                    <OrganizationsFilters filtersChanged={this.filter.bind(this)} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to='/creditOrganizations/create'>
                        <Button color="primary">
                            Добавить
                        </Button>
                    </Link>
                    <div className="pagination-area">
                        {
                            this.state.pageCount > 1 && this.state.data.length > 0
                                ? (
                                    <div id="react-paginate" className="d-flex justify-content-center mb-3">
                                        <ReactPaginate
                                            previousLabel="<"
                                            nextLabel=">"
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={this.handlePageClick.bind(this)}
                                            forcePage={this.state.selected}
                                        >
                                        </ReactPaginate>
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
                <div>
                    {
                        this.state.data.length > 0 ?
                            (
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
                                                    <td>{ (this.state.page - 1) * this.perPage + index + 1 }</td>
                                                    <td>{ el.BIC }</td>
                                                    <td>{ el.name }</td>
                                                    <td>{ el.Tnp + ' ' + el.Nnp + ' ' + el.Adr }</td>
                                                    <td>{ el.account }</td>
                                                    <td className="d-flex">
                                                        <Link
                                                            className="mr-3 iconWrapper"
                                                            title="Редактировать"
                                                            to={{
                                                                pathname: `/creditOrganizations/${el.BIC}/update`
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faEdit}
                                                            />
                                                        </Link>
                                                        <div
                                                            className="iconWrapper"
                                                            title="Удалить"
                                                            onClick={() => {
                                                                this.removeClickHandler.bind(this)(el.BIC)
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>
                            ) : OrganizationsList.renderNoResults()
                    }
                </div>
                <div className="pagination-area">
                    {
                        this.state.pageCount > 1 && this.state.data.length > 0
                            ? (
                                <div id="react-paginate" className="d-flex justify-content-center mb-3">
                                    <ReactPaginate
                                        previousLabel="<"
                                        nextLabel=">"
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick.bind(this)}
                                        forcePage={this.state.selected}
                                    >
                                    </ReactPaginate>
                                </div>
                            ) : null
                    }
                </div>
            </div>
        )
    }
}

export default OrganizationsList;