import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons/index';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { renderNoResults } from './messages';

const OrganizationsDataView = ({data = [], page, perPage, removeCallback}) => (
    <div>
        {
            data.length > 0
                ? (
                    <Table>
                        <thead>
                        <tr>
                            {
                                Number.isInteger(page) && Number.isInteger(perPage)
                                    ? (
                                        <th>#</th>
                                    )
                                    : null
                            }
                            <th>БИК</th>
                            <th>Название</th>
                            <th>Адрес</th>
                            <th>Корсчет</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        {
                                            Number.isInteger(page) && Number.isInteger(perPage)
                                                ? (
                                                    <td>{ (page - 1) * perPage + index + 1 }</td>
                                                )
                                                : null
                                        }
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
                                                    removeCallback(el.BIC);
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
                )
                : typeof renderNoResults === 'function' ? renderNoResults() : null
        }
    </div>
);

OrganizationsDataView.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            BIC: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            Tnp: PropTypes.string.isRequired,
            Nnp: PropTypes.string.isRequired,
            Adr: PropTypes.string.isRequired,
            account: PropTypes.string.isRequired
        })
    ),
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    removeCallback: PropTypes.func.isRequired
};

export default OrganizationsDataView;