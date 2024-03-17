import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './OrganizationAgendaItems.module.css';

interface InterfaceAgendaItemCreateModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  deleteAgendaItemHandler: () => Promise<void>;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
}

const AgendaItemPreviewModal: React.FC<InterfaceAgendaItemCreateModalProps> = ({
  agendaItemDeleteModalIsOpen,
  deleteAgendaItemHandler,
  toggleDeleteModal,
  t,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id={`deleteAgendaItemModal`}
        show={agendaItemDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        className={styles.agendaItemModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteAgendaItem`}>
            {t('deleteAgendaItem')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('deleteAgendaItemMsg')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="agendaItemDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteAgendaItemHandler}
            data-testid="deleteAgendaItemBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgendaItemPreviewModal;
