import {
  UPDATE_AGENDA_ITEM_MUTATION,
  DELETE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem1',
        assigneeId: 'user2',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem1',
        assigneeId: 'user1',
        preCompletionNotes: 'Pre Completion Notes',
        postCompletionNotes: 'this agenda item has been completed successfully',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem2',
        assigneeId: 'user1',
        preCompletionNotes: 'this agenda item has been made active again',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem1',
      },
    },
    result: {
      data: {
        removeAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
];

export const MOCKS_ERROR_MUTATIONS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem1',
        assigneeId: 'user2',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: '',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        agendaItemId: 'agendaItem1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
