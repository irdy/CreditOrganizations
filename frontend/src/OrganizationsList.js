import React from 'react';
import ReactPaginate from 'react-paginate';
import Heading from './Heading';
import { Button } from 'reactstrap';
import OrganizationsFilters from './OrganizationsFilters';
import { Link } from 'react-router-dom'
import InfoModal from './InfoModal';
import OrganizationsDataView from './OrganizationsDataView';
import config from './config.json';

const { SERVER_URL } = config;
class OrganizationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            pageCount: 1,
            entriesCount: 0,
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
        let URL = SERVER_URL + '/api/creditOrganizations';
        URL = OrganizationsList.addSearchParams(URL, this.createParamsCollection());
        fetch(URL, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let { entries, page, pageCount, entriesCount } = data;
                    if (Array.isArray(entries) && Number.isInteger(page) && Number.isInteger(pageCount)) {
                        this.setState({
                            data: entries,
                            page,
                            entriesCount,
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

    openModal(message) {
        this.setState({
            modalOpened: true,
            modalMessage: message
        })
    }

    remove(bic) {
        let URL = SERVER_URL + '/api/creditOrganizations/' + bic;
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

    removeCallback(BIC) {
        let message = "Вы действительно хотите удалить эту запись?";
        if (window.confirm(message)) {
            this.remove(BIC);
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
                                )
                                : null
                        }
                    </div>
                </div>
                <OrganizationsDataView
                    data={this.state.data}
                    page={this.state.page}
                    perPage={this.perPage}
                    removeCallback={this.removeCallback.bind(this)}
                />
                <div className="d-flex justify-content-center align-items-center">
                    {
                        this.state.entriesCount
                            ? (
                                <p className="mb-2">
                                    <small className="text-primary">
                                        Всего организаций - { this.state.entriesCount }
                                    </small>
                                </p>
                            )
                            : null
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
                            )
                            : null
                    }
                </div>
            </div>
        )
    }
}

export default OrganizationsList;