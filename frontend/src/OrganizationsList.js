import React from 'react';
import ReactPaginate from 'react-paginate';
import Heading from './Heading';
import { Button } from 'reactstrap';
import OrganizationsFilters from './OrganizationsFilters';
import { Link } from 'react-router-dom'
import InfoModal from './InfoModal';
import OrganizationsDataView from './OrganizationsDataView';
import config from './config.json';
import { LazyBox } from './LazyBox';
import { fetchData } from './utils/fetchData';

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
            isOpen: false,
            modalMessage: '',
            modalControls: {
                ok: true,
                cancel: true
            },
            modalOkCallback: () => {},
            modalCancelCallback: () => {},
            dataLoaded: false
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

        fetchData(URL, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(data => {
                let { entries, page, pageCount, entriesCount } = data;
                if (Array.isArray(entries) && Number.isInteger(page) && Number.isInteger(pageCount)) {
                    this.setState({
                        data: entries,
                        page,
                        entriesCount,
                        pageCount,
                        dataLoaded: true
                    })
                } else {
                    console.error('received incorrect data')
                }
            })
            .catch(err => {
                if (err.message) {
                    this.openInfoModal(err.message);
                }
            });
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

    openInfoModal(modalMessage) {
        this.setState({
            isOpen: true,
            modalMessage,
            modalOkCallback: this.closeModal,
            modalCancelCallback: () => {},
            modalControls: {
                ...this.state.modalControls,
                ...{
                    ok: true,
                    cancel: false
                }
            }
        })
    }

    openConfirmModal(modalMessage, BIC) {
        this.setState({
            isOpen: true,
            modalMessage,
            modalOkCallback: () => {this.remove(BIC)},
            modalCancelCallback: this.closeModal,
            modalControls: {
                ...this.state.modalControls,
                ...{
                    ok: true,
                    cancel: true
                }
            }
        });
    }

    closeModal() {
        this.setState({
            isOpen: false,
            modalMessage: ''
        })
    }

    remove(bic) {
        let URL = SERVER_URL + '/api/creditOrganizations/' + bic;

        fetchData(URL, {
            method: 'DELETE'
        })
            .then(data => {
                if (data.message && typeof data.message === 'string') {
                    this.openInfoModal(data.message);
                }
                this.loadData();
            })
            .catch(err => {
                if (err.message) {
                    this.openInfoModal(err.message)
                }
            })
    }

    removeCallback(BIC) {
        const message = "Вы действительно хотите удалить эту запись?";
        this.openConfirmModal(message, BIC);
    }

    render() {
        return (
            <div className="container">
                <InfoModal
                    isOpen={this.state.isOpen}
                    message={this.state.modalMessage}
                    modalControls={this.state.modalControls}
                    okCallback={this.state.modalOkCallback.bind(this)}
                    cancelCallback={this.state.modalCancelCallback.bind(this)}
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
                <LazyBox
                    component={
                    <OrganizationsDataView
                        data={this.state.data}
                        page={this.state.page}
                        perPage={this.perPage}
                        removeCallback={this.removeCallback.bind(this)}
                    />}
                    dataLoaded={this.state.dataLoaded}
                />

                <div className="d-flex justify-content-center align-items-center">
                    {
                        this.state.data.length > 0
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