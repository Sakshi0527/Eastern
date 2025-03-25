import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ViewUserDetails = ({ show, onHide, userDetails }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="view-header" closeButton>
        <Modal.Title>View User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
                <table striped hover size="sm" className="w-100">
                    <tbody className='viewUser-table'>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Name:</td>
                            <td className="viewUser-label">{userDetails?.name}</td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Email:</td>
                            <td className="viewUser-label">{userDetails?.email}</td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Role:</td>
                            <td className="viewUser-label">{userDetails?.role?.name}</td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Dob:</td>
                            <td className="viewUser-label">{userDetails?.dob}</td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Profile:</td>
                            <td className="viewUser-label"><Link to={userDetails?.profile} target='_blank' className='text-decoration-none'>View</Link></td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Gender:</td>
                            <td className="viewUser-label">{userDetails?.gender_text}</td>
                        </tr>
                        <tr className="viewUser-wrapper">
                            <td className="viewUser-label">Status:</td>
                            <td className="viewUser-label">{userDetails?.status_text}</td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUserDetails;
