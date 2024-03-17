import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from 'components/AgendaItems/AgendaItemsWrapper.module.css';
import { AgendaItemsModalBody } from './AgendaItemsModalBody';
import { useTranslation } from 'react-i18next';

export interface InterfaceModalProp {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
}

export const AgendaItemsModal = (props: InterfaceModalProp): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaItems',
  });

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        centered
        dialogClassName={styles.agendaItemsModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" data-testid="modal-title">
            {t('eventAgendaItems')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgendaItemsModalBody
            organizationId={props.orgId}
            eventId={props.eventId}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
