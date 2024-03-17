import {
  CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';

import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        agendaCategory: [
          {
            _id: '1',
            name: 'AgendaItemCategory 1',
            isDisabled: false,
          },
          {
            _id: '2',
            name: 'AgendaItemCategory 2',
            isDisabled: true,
          },
          {
            _id: '3',
            name: 'AgendaItemCategory 3',
            isDisabled: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: { name: 'AgendaItemCategory 4', organizationId: '123' },
    },
    result: {
      data: {
        createAgendaCategory: {
          _id: '4',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'AgendaItemCategory 1 updated',
        agendaItemCategoryId: '1',
      },
    },
    result: {
      data: {
        updateAgendaItemCategory: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: true,
        agendaItemCategoryId: '1',
      },
    },
    result: {
      data: {
        updateAgendaItemCategory: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        agendaItemCategoryId: '2',
      },
    },
    result: {
      data: {
        updateAgendaItemCategory: {
          _id: '2',
        },
      },
    },
  },
];

export const MOCKS_ERROR_QUERY = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_MUTATIONS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        agendaCategory: [
          {
            _id: '1',
            name: 'AgendaItemCategory 1',
            isDisabled: false,
          },
          {
            _id: '2',
            name: 'AgendaItemCategory 2',
            isDisabled: true,
          },
          {
            _id: '3',
            name: 'AgendaItemCategory 3',
            isDisabled: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: { name: 'AgendaItemCategory 4', organizationId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'AgendaItemCategory 1 updated',
        agendaItemCategoryId: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: true,
        agendaItemCategoryId: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        agendaItemCategoryId: '2',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
