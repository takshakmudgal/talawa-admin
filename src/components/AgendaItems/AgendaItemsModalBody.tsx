import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import styles from 'components/AgendaItems/AgendaItemsWrapper.module.css';
import type {
  InterfaceAgendaItemCategoryList,
  InterfaceAgendaItemList,
  InterfaceMembersList,
} from 'utils/interfaces';

import AgendaItemsContainer from 'components/AgendaItems/AgendaItemsContainer';
import Loader from 'components/Loader/Loader';
import { WarningAmberRounded } from '@mui/icons-material';
import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/AgendaItemMutations';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import AgendaItemCreateModal from 'screens/OrganizationAgendaItems/AgendaItemCreateModal';
import { useTranslation } from 'react-i18next';

export const AgendaItemsModalBody = ({
  organizationId,
  eventId,
}: {
  organizationId: string;
  eventId: string;
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaItems',
  });

  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [agendaItemCreateModalIsOpen, setAgendaItemCreateModalIsOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    agendaItemCategoryId: '',
    assigneeId: '',
    preCompletionNotes: '',
  });

  const {
    data: agendaItemCategoriesData,
    loading: agendaItemCategoriesLoading,
    error: agendaItemCategoriesError,
  }: {
    data: InterfaceAgendaItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(AGENDA_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  }: {
    data: InterfaceMembersList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(MEMBERS_LIST, {
    variables: { id: organizationId },
  });

  const {
    data: agendaItemsData,
    loading: agendaItemsLoading,
    error: agendaItemsError,
    refetch: agendaItemsRefetch,
  }: {
    data: InterfaceAgendaItemList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(AGENDA_ITEM_LIST, {
    variables: {
      organizationId,
      eventId,
      orderBy: 'createdAt_DESC',
    },
    notifyOnNetworkStatusChange: true,
  });

  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

  const createAgendaItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createAgendaItem({
        variables: {
          assigneeId: formState.assigneeId,
          agendaItemCategoryId: formState.agendaItemCategoryId,
          eventId,
          preCompletionNotes: formState.preCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
        },
      });

      setFormState({
        assigneeId: '',
        agendaItemCategoryId: '',
        preCompletionNotes: '',
      });

      setDueDate(new Date());

      agendaItemsRefetch();
      hideCreateModal();
      toast.success(t('successfulCreation'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const showCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  const hideCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  if (agendaItemCategoriesLoading || membersLoading || agendaItemsLoading) {
    return <Loader size="xl" />;
  }

  if (agendaItemCategoriesError || membersError || agendaItemsError) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading{' '}
          {agendaItemCategoriesError
            ? 'Agenda Item Categories'
            : membersError
              ? 'Members List'
              : 'Agenda Items List'}{' '}
          Data
          <br />
          {agendaItemCategoriesError
            ? agendaItemCategoriesError.message
            : membersError
              ? membersError.message
              : agendaItemsError?.message}
        </h6>
      </div>
    );
  }

  const agendaItemCategories = agendaItemCategoriesData?.agendaCategory.filter(
    (category) => !category.isDisabled,
  );

  const completedAgendaItemsCount =
    agendaItemsData?.agendaItemsByOrganization.reduce(
      (acc, item) => (item.isCompleted === true ? acc + 1 : acc),
      0,
    );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <span className="fw-bold text-secondary ms-2">
          <span className="d-none d-md-inline fw-bold text-dark">Status: </span>
          {agendaItemsData?.agendaItemsByOrganization.length} agenda items
          assigned, {completedAgendaItemsCount} completed
        </span>

        <Button
          type="submit"
          className={styles.greenregbtn}
          value="createEventAgendaItem"
          data-testid="createEventAgendaItemBtn"
          onClick={showCreateModal}
        >
          {t('createAgendaItem')}
        </Button>
      </div>

      <AgendaItemsContainer
        agendaItemsConnection={`Event`}
        agendaItemsData={agendaItemsData?.agendaItemsByOrganization}
        membersData={membersData?.organizations[0].members}
        agendaItemsRefetch={agendaItemsRefetch}
      />

      {/* Create Modal */}
      <AgendaItemCreateModal
        agendaItemCreateModalIsOpen={agendaItemCreateModalIsOpen}
        hideCreateModal={hideCreateModal}
        formState={formState}
        setFormState={setFormState}
        createAgendaItemHandler={createAgendaItemHandler}
        t={t}
        agendaItemCategories={agendaItemCategories}
        membersData={membersData?.organizations[0].members}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />
    </>
  );
};
