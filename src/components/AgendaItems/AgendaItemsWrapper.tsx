import React, { useState } from 'react';
import { AgendaItemsModal } from './AgendaItemsModal';
import { Button } from 'react-bootstrap';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './AgendaItemsWrapper.module.css';
import { useTranslation } from 'react-i18next';

type PropType = {
  orgId: string;
  eventId: string;
};

export const AgendaItemsWrapper = (props: PropType): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaItems',
  });

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="light"
        className="text-secondary"
        aria-label="eventDashboardAgendaItems"
        onClick={(): void => {
          setShowModal(true);
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Agenda Items" fill="var(--bs-secondary)" />
        </div>
        {t('eventAgendaItems')}
      </Button>
      {showModal && (
        <AgendaItemsModal
          show={showModal}
          handleClose={(): void => setShowModal(false)}
          orgId={props.orgId}
          eventId={props.eventId}
        />
      )}
    </>
  );
};
