import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import SortIcon from '@mui/icons-material/Sort';
import { WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { useMutation, useQuery } from '@apollo/client';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import type {
  InterfaceAgendaItemCategoryList,
  InterfaceAgendaItemList,
  InterfaceMembersList,
} from 'utils/interfaces';
import AgendaItemsContainer from 'components/AgendaItems/AgendaItemsContainer';
import AgendaItemCreateModal from './AgendaItemCreateModal';
import styles from './OrganizationAgendaItems.module.css';
import Loader from 'components/Loader/Loader';

function organizationAgendaItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaItems',
  });

  const { orgId: currentUrl } = useParams();

  const [agendaItemCreateModalIsOpen, setAgendaItemCreateModalIsOpen] =
    useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [orderBy, setOrderBy] = useState<'Latest' | 'Earliest'>('Latest');
  const [agendaItemStatus, setAgendaItemStatus] = useState('');
  const [agendaItemCategoryId, setAgendaItemCategoryId] = useState('');
  const [agendaItemCategoryName, setAgendaItemCategoryName] = useState('');

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
      organizationId: currentUrl,
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
    variables: { id: currentUrl },
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
      organizationId: currentUrl,
      agendaItemCategoryId,
      orderBy: orderBy === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
      isActive: agendaItemStatus === 'Active' ? true : false,
      isCompleted: agendaItemStatus === 'Completed' ? true : false,
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

  const handleSorting = (sort: string): void => {
    if (sort === 'Latest') {
      setOrderBy('Latest');
    } else {
      setOrderBy('Earliest');
    }
  };

  const handleStatusFilter = (status: string): void => {
    if (status === 'Active') {
      setAgendaItemStatus('Active');
    } else {
      setAgendaItemStatus('Completed');
    }
  };

  const handleClearFilters = (): void => {
    setAgendaItemCategoryId('');
    setAgendaItemCategoryName('');
    setAgendaItemStatus('');
    setOrderBy('Latest');
  };

  if (agendaItemCategoriesLoading || membersLoading || agendaItemsLoading) {
    return <Loader size="xl" />;
  }

  if (agendaItemCategoriesError || membersError || agendaItemsError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
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
      </div>
    );
  }

  const agendaItemCategories = agendaItemCategoriesData?.agendaCategory.filter(
    (category) => !category.isDisabled,
  );

  return (
    <div className={styles.organizationAgendaItemsContainer}>
      <Button
        variant="success"
        onClick={showCreateModal}
        data-testid="createAgendaItemBtn"
        className={styles.createAgendaItemButton}
      >
        <i className={'fa fa-plus me-2'} />
        {t('createAgendaItem')}
      </Button>
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={`mt-4 mx-4`}>
          <div className={styles.btnsContainer}>
            <div className={styles.btnsBlock}>
              <Dropdown
                aria-expanded="false"
                title="Sort Agenda Items"
                data-testid="sort"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortAgendaItems"
                >
                  <div className="d-none d-md-inline">
                    <SortIcon className={'me-1'} />
                  </div>
                  {orderBy === 'Latest' ? t('latest') : t('earliest')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(): void => handleSorting('Latest')}
                    data-testid="latest"
                  >
                    {t('latest')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(): void => handleSorting('Earliest')}
                    data-testid="earliest"
                  >
                    {t('earliest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                aria-expanded="false"
                title="Agenda Item Categories"
                data-testid="agendaItemCategories"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant={
                    agendaItemCategoryName === ''
                      ? 'outline-success'
                      : 'success'
                  }
                  data-testid="selectAgendaItemCategory"
                >
                  <div className="d-lg-none">
                    {agendaItemCategoryName === ''
                      ? t('agendaItemCategory')
                      : agendaItemCategoryName}
                  </div>
                  <div className="d-none d-lg-inline">
                    {t('agendaItemCategory')}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {agendaItemCategories?.map((category, index) => (
                    <Dropdown.Item
                      key={index}
                      data-testid="agendaItemCategory"
                      onClick={() => {
                        setAgendaItemCategoryId(category._id);
                        setAgendaItemCategoryName(category.name);
                      }}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                aria-expanded="false"
                title="Agenda Item Status"
                data-testid="agendaItemStatus"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant={
                    agendaItemStatus === '' ? 'outline-success' : 'success'
                  }
                  data-testid="selectAgendaItemStatus"
                >
                  <div className="d-lg-none">
                    {agendaItemStatus === '' ? t('status') : agendaItemStatus}
                  </div>
                  <div className="d-none d-lg-inline">{t('status')}</div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(): void => handleStatusFilter('Active')}
                    data-testid="activeAgendaItems"
                  >
                    {t('active')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(): void => handleStatusFilter('Completed')}
                    data-testid="completedAgendaItems"
                  >
                    {t('completed')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="mt-3 d-none d-lg-inline flex-grow-1 d-flex align-items-center border bg-light-subtle rounded-3">
              {!agendaItemCategoryName && !agendaItemStatus && (
                <div className="lh-lg mt-2 text-center fw-semibold text-body-tertiary">
                  No Filters
                </div>
              )}

              {agendaItemCategoryName !== '' && (
                <div className="badge text-bg-secondary bg-dark-subtle bg-gradient lh-lg mt-2 ms-2 text-body-secondary">
                  {agendaItemCategoryName}
                  <i
                    className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary pe-auto`}
                    onClick={() => {
                      setAgendaItemCategoryName('');
                      setAgendaItemCategoryId('');
                    }}
                    data-testid="clearAgendaItemCategoryFilter"
                  />
                </div>
              )}

              {agendaItemStatus !== '' && (
                <div className="badge text-bg-secondary bg-dark-subtle bg-gradient lh-lg mt-2 ms-2 text-secondary-emphasis">
                  {agendaItemStatus}
                  <i
                    className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary pe-auto`}
                    onClick={() => setAgendaItemStatus('')}
                    data-testid="clearAgendaItemStatusFilter"
                  />
                </div>
              )}
            </div>

            <Button
              variant="success"
              onClick={handleClearFilters}
              data-testid="clearFilters"
              className={styles.clearFiltersBtn}
            >
              <i className="fa fa-broom me-2"></i>
              {t('clearFilters')}
            </Button>
          </div>
        </div>

        <hr />

        <AgendaItemsContainer
          agendaItemsConnection={`Organization`}
          agendaItemsData={agendaItemsData?.agendaItemsByOrganization}
          membersData={membersData?.organizations[0].members}
          agendaItemsRefetch={agendaItemsRefetch}
        />
      </div>

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
    </div>
  );
}

export default organizationAgendaItems;
