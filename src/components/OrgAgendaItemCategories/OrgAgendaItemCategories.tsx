import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './OrgAgendaItemCategories.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import type { InterfaceAgendaItemCategoryList } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { useParams } from 'react-router-dom';

type ModalType = 'Create' | 'Update';

const OrgAgendaItemCategories = (): any => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgAgendaItemCategories',
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('Create');
  const [categoryId, setCategoryId] = useState('');

  const [name, setName] = useState('');
  const [currName, setCurrName] = useState('');

  const { orgId: currentUrl } = useParams();

  const {
    data,
    loading,
    error,
    refetch,
  }: {
    data: InterfaceAgendaItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(AGENDA_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [createAgendaCategory] = useMutation(
    CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  const [updateAgendaItemCategory] = useMutation(
    UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  const handleCreate = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createAgendaCategory({
        variables: {
          name,
          organizationId: currentUrl,
        },
      });

      setName('');
      refetch();

      setModalIsOpen(false);

      toast.success(t('successfulCreation'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEdit = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (name === currName) {
      toast.error(t('sameNameConflict'));
    } else {
      try {
        await updateAgendaItemCategory({
          variables: {
            agendaItemCategoryId: categoryId,
            name,
          },
        });

        setName('');
        setCategoryId('');
        refetch();

        setModalIsOpen(false);

        toast.success(t('successfulUpdation'));
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    }
  };

  const handleStatusChange = async (
    id: string,
    disabledStatus: boolean,
  ): Promise<void> => {
    try {
      await updateAgendaItemCategory({
        variables: {
          agendaItemCategoryId: id,
          isDisabled: !disabledStatus,
        },
      });

      refetch();

      toast.success(
        disabledStatus ? t('categoryEnabled') : t('categoryDisabled'),
      );
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const showCreateModal = (): void => {
    setModalType('Create');
    setModalIsOpen(true);
  };

  const showUpdateModal = (name: string, id: string): void => {
    setCurrName(name);
    setName(name);
    setCategoryId(id);
    setModalType('Update');
    setModalIsOpen(true);
  };

  const hideModal = (): void => {
    setName('');
    setCategoryId('');
    setModalIsOpen(false);
  };

  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading Agenda Item Categories Data
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  const agendaItemCategories = data?.agendaCategory;

  return (
    <>
      <Button
        variant="success"
        value="savechanges"
        onClick={showCreateModal}
        className={styles.addButton}
        data-testid="agendaItemCategoryModalOpenBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {t('createButton')}
      </Button>

      <div>
        {agendaItemCategories?.map((category, index) => {
          return (
            <div key={index}>
              <div className="my-3 d-flex justify-content-between align-items-center">
                <h6
                  className={
                    category.isDisabled
                      ? 'text-secondary fw-bold mb-0'
                      : 'fw-bold mb-0'
                  }
                >
                  {category.name}
                </h6>
                <div>
                  <Button
                    onClick={() => showUpdateModal(category.name, category._id)}
                    size="sm"
                    variant="secondary"
                    className="me-2"
                    data-testid="agendaItemCategoryUpdateModalOpenBtn"
                  >
                    {t('editButton')}
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusChange(category._id, category.isDisabled)
                    }
                    size="sm"
                    variant={category.isDisabled ? 'outline-success' : 'danger'}
                    data-testid="disabilityStatusButton"
                  >
                    {category.isDisabled
                      ? t('enableButton')
                      : t('disableButton')}
                  </Button>
                </div>
              </div>

              {index !== agendaItemCategories.length - 1 && <hr />}
            </div>
          );
        })}
      </div>

      <Modal
        className={styles.createModal}
        show={modalIsOpen}
        onHide={hideModal}
      >
        <Modal.Header>
          <p className={`${styles.titlemodal}`}>
            {t('agendaItemCategoryDetails')}
          </p>
          <Button
            variant="danger"
            onClick={hideModal}
            data-testid="agendaItemCategoryModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmitCapture={modalType === 'Create' ? handleCreate : handleEdit}
          >
            <Form.Label
              className="ms-1 fs-5 mt-2 mb-0"
              htmlFor="agendaItemCategoryName"
            >
              {t('agendaItemCategoryName')}
            </Form.Label>
            <Form.Control
              type="title"
              id="agendaItemCategoryName"
              placeholder={t('enterName')}
              autoComplete="off"
              required
              value={name}
              onChange={(e): void => {
                setName(e.target.value);
              }}
            />
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="creatAgendaItemCategory"
              data-testid="formSubmitButton"
            >
              {modalType === 'Create'
                ? t('createButton')
                : t('updateAgendaItemCategory')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrgAgendaItemCategories;
