import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "react-bootstrap";

const ConfirmationModal = ({
  isOpen,
  toggle,
  onConfirm,
  headerText,
  bodyText,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter className="border-0">
        <Button color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Yes, Sure..." : "Yes, Sure"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
